// returns GeoFire-wrapped firebase reference to bunkers

app.factory('GeoFireFactory', function (FbFactory) {
  let instance = FbFactory.getFirebaseRef()

  // return all bunkers in firebase bunkers column
  let geofire = new window.GeoFire(instance.child('locations'))

  // for converting coordinates from GeoFire radius query in array format to object format
  // this is useful for consistency (final is {lat: FLOAT, lng: FLOAT})
  geofire.convertResultstoObj = function (latlng) {
    let [lat, lng] = latlng
    return {lat, lng}
  }
  geofire.distance = window.GeoFire.distance
  return geofire
})
