app.factory('LocationWatcherFactory', function (ArFactory, GeoFireFactory, leafletData, DistanceFactory, $rootScope) {
  /* GLOBALS */
  const mapReloadDistance = 200 // distance moved (meters) before panning map to new center
  const dataReloadDistance = 1000 // distance moved before making GeoFire query for bunkers + other markers...
  let center
  let lastFetchedCenter // this is the last center used to make a GeoFire query

  let nw // coordinates of map top-left corner (lat/long)
  let ne // " top-right corner (lat/long)
  let sw // " bottom-left corner (lat/long)
  let size // total size of map, represented by object with height(h) and width(w) in meters
  let bunkers = []

  // compares previous location with current location, returns boolean
  // if previous is undefined, as in at map loading, return true to pan map, get bunkers etc etc.
  let diff = (loc, prev, sensitivity = 0) => prev
    ? DistanceFactory.greaterThanXM(loc, prev, sensitivity)
    : true

  // callback used by navigator.geolocation.watchPosition, decides to execute callback chain
  // new position upon location change is constantly fed in as parameter
  function success (geoObj) {
    let loc = {lat: geoObj.coords.latitude, lng: geoObj.coords.longitude}
    if (diff(loc, center, mapReloadDistance)) {
      mapMover(loc)
    }
  }

  // exported watcher function, runs all map code
  let watch = function () {
    navigator.geolocation.watchPosition(success, console.warn, {enableHighAccuracy: true})
  }

  // Does a bunch of stuff with location info
  function mapMover (geoObj) {
    let prevCenter = center || {lat: 0, lng: 0} // avoids undefined previous center on initial load
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
        if (diff(center, lastFetchedCenter, dataReloadDistance)) queryBunkers(center)
        else updatePhaser() // send payload to phaser without making query, for updating which markers/bunkers are in bounds
      })
  }

  // returns corners that complete a rectangle with parameters as opposite corners
  // EX: {lat: 0, lng: 0}, {lat: 1, lng: 1} returns [{lat: 0, lng: 1}, {lat: 1, lng: 0}]
  // <----- HELPER FUNCTION ------>
  function getIntersects (point1, point2) {
    return [{lat: point1.lat, lng: point2.lng}, {lat: point2.lat, lng: point1.lng}]
  }
  // returns {height: (meters), width: (meters)} for rectangle with 3 points
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
  // Querying geoFire
  function queryBunkers (geoObj) {
    lastFetchedCenter = geoObj
    bunkers = []
    let query = GeoFireFactory.query({
      center: [geoObj.lat, geoObj.lng],
      radius: 1
    })
    query.on('key_entered', (id, latlng, dist) => {
      bunkers.push({id, coords: GeoFireFactory.convertResultstoObj(latlng)})
    })
    query.on('ready', () => {
      updatePhaser()
      query.cancel()
    })
  }

  // Converting cummulated geofire objects to our data
  function updatePhaser () {
    $rootScope.$broadcast('updateAR', bunkers.filter(inMapBounds).map(toXY))
  }

  // checks if given bunker {coords: {lat, lng}} should show on map
  function inMapBounds (bunker) {
    let lat = bunker.coords.lat
    let lng = bunker.coords.lng
    return (sw.lat <= lat && sw.lng <= lng) && (ne.lat >= lat && ne.lng >= lng)
  }

  // convert bunker coordinates to x, y where x = % from left of map
  // y = % from top of map
  function toXY (bunker) {
    let point = bunker.coords
    let [NE, SW] = getIntersects(nw, point)
    let pointDist = getSize(nw, NE, SW)
    let coords = {x: pointDist.w / size.w, y: pointDist.h / size.h}
    return {id: bunker.id, coords: coords}
  }

  return {watch}
})
