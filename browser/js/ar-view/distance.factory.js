app.factory('DistanceFactory', function (GeoFireFactory) {
  // returns boolean, is true if distance between 2 coordinates
  // is greater than some sensitivity (3rd parameter)
  function greaterThanXM (loc1, loc2, meters) {
    console.log(loc1, loc2)
    return convertToMeters(loc1, loc2) > meters
  }

  // Haversine's formula (distance in meters between two coordinates (lat, long))
  function convertToMeters (loc1, loc2) {
    return GeoFireFactory.distance([loc1.lat, loc1.lng], [loc2.lat, loc2.lng]) * 1000
  }

  /*
  Following code from geoFire source code. Inaccessable through api, so including here
  */
  function degreesToRadians (degrees) {
    if (typeof degrees !== 'number' || isNaN(degrees)) {
      console.log(degrees, typeof degrees)
      throw new Error('Error: degrees must be a number')
    }

    return (degrees * Math.PI / 180)
  }
  const earthEqRadius = 6378137.0
  // Cutoff for rounding errors on double calculations
  const epsilon = 1e-12
  // The following value assumes a polar radius of
  // var g_EARTH_POL_RADIUS = 6356752.3
  // The formulate to calculate g_E2 is
  // g_E2 == (g_EARTH_EQ_RADIUS^2-g_EARTH_POL_RADIUS^2)/(g_EARTH_EQ_RADIUS^2)
  // The exact value is used here to avoid rounding errors
  const gE2 = 0.00669447819799
  var metersToLongitudeDegrees = function (distance, latitude) {
    var radians = degreesToRadians(latitude)
    var num = Math.cos(radians) * earthEqRadius * Math.PI / 180
    var denom = 1 / Math.sqrt(1 - gE2 * Math.sin(radians) * Math.sin(radians))
    var deltaDeg = num * denom
    if (deltaDeg < epsilon) {
      return distance > 0 ? 360 : 0
    } else {
      return Math.min(360, distance / deltaDeg)
    }
  }
  function metersToLatitudeDegrees (distance, longitude) {
    return distance / 111320 // may perfect later, for now, this is precise enough
  }
  return {greaterThanXM, convertToMeters, metersToLongitudeDegrees, metersToLatitudeDegrees}
})
