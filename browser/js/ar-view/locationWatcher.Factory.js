/* eslint no-debugger: "off" */
app.factory('LocationWatcherFactory', function (ArFactory, GeoFireFactory, leafletData, DistanceFactory, $rootScope, GridFactory, $http, $interval) {
  /* GLOBALS */
  const mapReloadDistance = 100 // distance moved (meters) before panning map to new center
  const dataReloadDistance = 1000 // distance moved before making GeoFire query for bunkers + other markers...
  let center
  let lastFetchedCenter // this is the last center used to make a GeoFire query

  // let nw // coordinates of map top-left corner (lat/long)
  // let ne // " top-right corner (lat/long)
  // let sw // " bottom-left corner (lat/long)
  // let size // total size of map, represented by object with height(h) and width(w) in meters
  let pointsOfInterest = []
  let foundPoints = []

  $rootScope.$on('DeleteMarker', function (event, data) {
    if (data.type && data.id) {
      const key = `${data.type}_${data.id}`
      _.remove(pointsOfInterest, point => point.id === key)
      mapMover(center)
      $http.put(`/api/points/${data.id}`, {type: data.type})
    }
  // updatePhaser()
  })
  // exported watcher function, runs all map code
  // function refresh () {
  //   if (center) {
  //     console.log(center)
  //     mapMover(center)
  //   }
  // }
  let watch = function () {
    if (!center) {
      navigator.geolocation.watchPosition(success, console.warn, {enableHighAccuracy: true})
    // setInterval(updatePhaser, 1000)
    } else mapMover(center)
  }

  // callback used by navigator.geolocation.watchPosition, decides to execute callback chain
  // new position upon location change is constantly fed in as parameter
  function success (geoObj) {
    let loc = {lat: geoObj.coords.latitude, lng: geoObj.coords.longitude}
    if (diff(loc, center, mapReloadDistance)) {
      mapMover(loc)
    }
  }

  // compares previous location with current location, returns boolean
  // if previous is undefined, as in at map loading, return true to pan map, get bunkers etc etc.
  let diff = (loc, prev, sensitivity = 0) => prev
    ? DistanceFactory.greaterThanXM(loc, prev, sensitivity)
    : true

  // Does a bunch of stuff with location info
  function mapMover (geoObj) {
    center = geoObj // resets center to new position after movement
    return leafletData.getMap()
      .then(map => {
        map.once('moveend', dataUpdate)
        map.panTo(geoObj)
      }) // move map view to new location on movement
  }

  function dataUpdate () {
    return leafletData.getMap()
      .then(map => {
        let bounds = map.getBounds() // updating global variables on movement
        const ne = bounds._northEast
        const sw = bounds._southWest
        const nw = getIntersects(ne, sw)[0]
        const size = getSize(nw, ne, sw)
        // only does GeoFire query if movement > dataReloadDistance
        if (diff(center, lastFetchedCenter, dataReloadDistance)) {
          // if (lastFetchedCenter) updatePhaser()
          return makeGrid(center)
            .then(() => queryPoints(center))
            .then(() => updatePhaser(sw, ne, nw, size))
        } else {
          // pointsOfInterest = Array.from(pointsOfInterest)
          let newNearest = GridFactory.getNearestPoints(center)
          $http.put('/api/grid', {newNearest})
          foundPoints = foundPoints.concat(newNearest)
          foundPoints = _.uniq(foundPoints)
          updatePhaser(sw, ne, nw, size) // send payload to phaser without making query, for updating which markers/bunkers are in bounds
        }
      })
  }

  // returns corners that complete a rectangle with parameters as opposite corners
  // (i.e. getIntersects (nwCorner, seCorner) => [neCorner, swCorner])
  // EX: point1 {lat: 0, lng: 0}, point2 {lat: 1, lng: 1} returns [{lat: 0, lng: 1}, {lat: 1, lng: 0}]
  // <----- HELPER FUNCTION ------>
  function getIntersects (point1, point2) {
    return [{lat: point1.lat, lng: point2.lng}, {lat: point2.lat, lng: point1.lng}]
  }
  // returns {height: (meters), width: (meters)} for rectangle with 3 point
  /*
  middleCorner __________horizontal
  |                                |
  vertical_________________________|
  * */
  function getSize (middleCorner, horizontal, vertical) {
    return {
      h: DistanceFactory.convertToMeters(middleCorner, vertical),
      w: DistanceFactory.convertToMeters(middleCorner, horizontal)
    }
  }
  // Making the grid
  function makeGrid () {
    let grid = GridFactory.makeGrid(center)
    let corners = GridFactory.getNearestPoints(center)

    return $http.post('/api/grid', {grid, corners})
      .then(res => res.data.visited)
      .then(arr => arr.forEach(elem => {
        foundPoints.push(grid[elem])
      }))
  }

  // Querying geoFire
  function queryPoints (geoObj) {
    lastFetchedCenter = geoObj
    pointsOfInterest = []
    let query = GeoFireFactory.query({
      center: [geoObj.lat, geoObj.lng],
      radius: 2
    })
    query.on('key_entered', (id, latlng, dist) => {
      pointsOfInterest.push({id, coords: GeoFireFactory.convertResultstoObj(latlng)})
    })
    return new Promise(function (resolve, reject) {
      query.on('ready', () => {
        query.cancel()
        resolve()
      })
    })
  // query.on('ready', () => {
  //   updatePhaser()
  //   query.cancel()
  // })
  }
  const centerPoints = [{x: 0.5, y: 0.5}, {x: 0.55, y: 0.55}, {x: 0.55, y: 0.45}, {x: 0.45, y: 0.45}, {x: 0.45, y: 0.55}]
  // Converting cummulated geofire objects to our data
  function updatePhaser (sw, ne, nw, mapSize) {
    let data = {
      locations: pointsOfInterest.filter(x => inMapBounds(x.coords, sw, ne)).map(x => formatMarker(x, nw, mapSize)),
      visited: foundPoints.filter(x => inMapBounds(x, sw, ne)).map(x => toXY(x, nw, mapSize)).concat(centerPoints)
    }
    $rootScope.$broadcast('updateAR', data)
  }

  // checks if given bunker {coords: {lat, lng}} should show on map
  function inMapBounds (point, sw, ne) {
    let lat = point.lat
    let lng = point.lng
    return (sw.lat <= lat && sw.lng <= lng) && (ne.lat >= lat && ne.lng >= lng)
  }

  // convert bunker coordinates to x, y where x = % from left of map
  // y = % from top of map
  function formatMarker (point, nw, mapSize) {
    let [type, id] = point.id.split('_')
    let pos = toXY(point.coords, nw, mapSize)
    return {id, type, pos}
  }
  function toXY (coords, nw, size) {
    let [NE, SW] = getIntersects(nw, coords)
    // returns {height, width} corresponding to rectangle with
    // its top-left : map top-left corner, bottom-right: point coordinates
    let pointDist = getSize(nw, NE, SW)
    return {x: pointDist.w / size.w, y: pointDist.h / size.h}
  }
  return {watch}
})
