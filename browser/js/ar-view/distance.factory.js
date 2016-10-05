app.factory('DistanceFactory', function () {
  // returns boolean, is true if distance between 2 coordinates
  // is greater than some sensitivity (3rd parameter)
  function greaterThanXM (loc1, loc2, meters) {
    console.log(loc1, loc2)
    return convertToMeters(loc1, loc2) > meters
  }

  // Haversine's formula (distance in meters between two coordinates (lat, long))
  function convertToMeters (loc1, loc2) {
    const R = 6378.137 // Radius of earth in KM
    let dLat = loc2.lat * Math.PI / 180 - loc1.lat * Math.PI / 180
    let dLon = loc2.lng * Math.PI / 180 - loc1.lng * Math.PI / 180
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    let d = R * c
    return d * 1000 // meters
  }
  return {greaterThanXM, convertToMeters}
})
