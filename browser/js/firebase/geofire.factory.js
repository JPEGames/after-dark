// returns GeoFire-wrapped firebase reference to bunkers

app.factory('GeoFireFactory', function (FbFactory) {
  let instance = FbFactory.getFirebaseRef()
  console.log(instance)
  let geofire = new window.GeoFire(instance.child('bunkers'))
  return geofire
})
