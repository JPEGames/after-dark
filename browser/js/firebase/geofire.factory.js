app.factory('GeoFireFactory', function (FbFactory) {
  let instance = FbFactory.getFirebaseRef()
  let geofire = new window.GeoFire(instance.child('bunkers'))
  return geofire
})
