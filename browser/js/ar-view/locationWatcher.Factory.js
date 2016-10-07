app.factory('LocationWatcherFactory', function (ArFactory, GeoFireFactory, leafletData, DistanceFactory, $rootScope, GridFactory, $http) {
  /* GLOBALS */
  const mapReloadDistance = 200 // distance moved (meters) before panning map to new center
  const dataReloadDistance = 1000 // distance moved before making GeoFire query for bunkers + other markers...
  let center
  let lastFetchedCenter // this is the last center used to make a GeoFire query

  let nw // coordinates of map top-left corner (lat/long)
  let ne // " top-right corner (lat/long)
  let sw // " bottom-left corner (lat/long)
  let size // total size of map, represented by object with height(h) and width(w) in meters
  let pointsOfInterest = []
  let foundPoints = []

  // exported watcher function, runs all map code
  let watch = function () {
    navigator.geolocation.watchPosition(success, console.warn, {enableHighAccuracy: true})
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
      .then(map => map.panTo(geoObj)) // move map view to new location on movement
      .then(map => map.getBounds())
      .then(bounds => { // updating global variables on movement
        ne = bounds._northEast
        sw = bounds._southWest
        nw = getIntersects(ne, sw)[0]
        size = getSize(nw, ne, sw)
        // only does GeoFire query if movement > dataReloadDistance
        if (diff(center, lastFetchedCenter, dataReloadDistance)) {
          makeGrid(center)
            .then(() => queryPoints(center))
            .then(() => updatePhaser())
        } else updatePhaser() // send payload to phaser without making query, for updating which markers/bunkers are in bounds
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

  // Converting cummulated geofire objects to our data
  function updatePhaser () {
    $rootScope.$broadcast('updateAR', {locations: pointsOfInterest.filter(x => inMapBounds(x.coords)).map(formatMarker), visited: foundPoints.filter(inMapBounds).map(toXY)})
  }

  // checks if given bunker {coords: {lat, lng}} should show on map
  function inMapBounds (point) {
    let lat = point.lat
    let lng = point.lng
    return (sw.lat <= lat && sw.lng <= lng) && (ne.lat >= lat && ne.lng >= lng)
  }

  // convert bunker coordinates to x, y where x = % from left of map
  // y = % from top of map
  function formatMarker (point) {
    let [type, id] = point.id.split('_')
    let pos = toXY(point.coords)
    return {id, type, pos}
  }
  function toXY (coords) {
    let [NE, SW] = getIntersects(nw, coords)
    // returns {height, width} corresponding to rectangle with
    // its top-left : map top-left corner, bottom-right: point coordinates
    let pointDist = getSize(nw, NE, SW)
    return {x: pointDist.w / size.w, y: pointDist.h / size.h}
  }

  return {watch}
})
