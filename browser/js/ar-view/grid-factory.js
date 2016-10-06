app.factory('GridFactory', function (DistanceFactory) {
  const gridSpacing = 100 // meters
  const gridSize = 20 // squares w/h must be even
  function makeGrid (position) {
    console.log('making grid for', position)
    let lats = makeArray(...getClosestEvenLat(position))
    let nested = lats.map(lat => {
      let lngs = makeArray(...getClosestEvenLng(lat, position.lng))
      return lngs.map(lng => {
        return {lat, lng}
      })
    })
    return _.flatten(nested)
  }
  function getClosestEvenLng (lat, lng) {
    let lngInterval = DistanceFactory.metersToLongitudeDegrees(gridSpacing, lat)
    return [lng - (lng % lngInterval), lngInterval]
  }
  function getClosestEvenLat (position) {
    let latInterval = DistanceFactory.metersToLatitudeDegrees(gridSpacing, position.longitude)
    return [position.lat - (position.lat % latInterval), latInterval]
  }
  function makeArray (base, interval) {
    return Array(gridSize).fill(base).map((base, ind) => base + (interval * (ind - gridSize / 2)))
  }
  return {makeGrid}
})
