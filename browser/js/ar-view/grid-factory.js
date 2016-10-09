app.factory('GridFactory', function (DistanceFactory) {
  const gridSpacing = 100 // meters
  const gridSize = 20 // squares w/h must be even
  function makeGrid (position) {
    // makes array representing latitude points (of size gridSize) spaced over 100m intervals
    // center point is at closest latitude south of current position
    let lats = makeArray(...getClosestEvenLat(position))
    // for each latitude, make array representing longitude points (of size gridSize) spaced over
    // 100m intervals with center at given latitude
    let nested = lats.map(lat => {
      let lngs = makeArray(...getClosestEvenLng(lat, position.lng))
      return lngs.map(lng => {
        return {lat, lng}
      })
    })
    return _.flatten(nested)
  }
  // gets closest longitude interval for given position (will always be to the EAST)
  // in Western Hemisphere, returns in format [longitude of closest interval, # longitude degrees
  // corresponding to 100 meters at given latitude
  function getClosestEvenLng (lat, lng) {
    let lngInterval = DistanceFactory.metersToLongitudeDegrees(gridSpacing, lat)
    return [lng - (lng % lngInterval), lngInterval]
  }
  // gets closest latitude for given position (will always be to the SOUTH)
  // returns in format [latitude of closest interval, # latitude deg / 100 meters]
  function getClosestEvenLat (position) {
    let latInterval = DistanceFactory.metersToLatitudeDegrees(gridSpacing, position.longitude)
    return [position.lat - (position.lat % latInterval), latInterval]
  }
  // generate array of size gridSize with center position at middle index
  function makeArray (base, interval) {
    return Array(gridSize).fill(base).map((base, ind) => base + (interval * (ind - gridSize / 2)))
  }
  function getNearestPoints (position) {
    let [lat, latInter] = getClosestEvenLat(position)
    return _.flatten([lat, lat + latInter].map(lat => {
      let [lng, lngInter] = getClosestEvenLng(lat, position.lng)
      return [{lat, lng}, {lat, lng: (lng - lngInter)}]
    }))
  }
  return {makeGrid, getNearestPoints}
})
