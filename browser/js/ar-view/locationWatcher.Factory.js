app.factory('LocationWatcherFactory', function (ArFactory, GeoFireFactory, leafletData, DistanceFactory, $rootScope) {
  const mapReloadDistance = 200
  const dataReloadDistance = 1000
  let center
  let lastFetchedCenter
  let nw
  let ne
  let sw
  let size
  let bunkers = []

  // Making the watcher
  let diff = (loc, prev, sensitivity = 0) => prev
    ? DistanceFactory.greaterThanXM(loc, prev, sensitivity)
    : true

  function success (geoObj) {
    let loc = {lat: geoObj.coords.latitude, lng: geoObj.coords.longitude}
    if (diff(loc, center, mapReloadDistance)) {
      mapMover(loc)
    }
  }

  let watch = function () {
    navigator.geolocation.watchPosition(success, console.warn, {enableHighAccuracy: true})
  }

  // Does a bunch of stuff with location info
  function mapMover (geoObj) {
    let prevCenter = center || {lat: 0, lng: 0}
    center = geoObj
    return leafletData.getMap()
      .then(map => map.panTo(geoObj))
      .then(map => map.getBounds())
      .then(bounds => {
        ne = bounds._northEast
        sw = bounds._southWest
        nw = getIntersects(ne, sw)[0]
        size = getSize(nw, ne, sw)
        if (diff(prevCenter, lastFetchedCenter, dataReloadDistance)) queryBunkers(center)
        else updatePhaser()
      })
  }

  function getIntersects (point1, point2) {
    return [{lat: point1.lat, lng: point2.lng}, {lat: point2.lat, lng: point1.lng}]
  }
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

  function inMapBounds (bunker) {
    let lat = bunker.coords.lat
    let lng = bunker.coords.lng
    return (sw.lat <= lat && sw.lng <= lng) && (ne.lat >= lat && ne.lng >= lng)
  }

  function toXY (bunker) {
    let point = bunker.coords
    let [NE, SW] = getIntersects(nw, point)
    let pointDist = getSize(nw, NE, SW)
    return {x: pointDist.w / size.w, y: pointDist.h / size.h}
  }

  return {watch}
})
