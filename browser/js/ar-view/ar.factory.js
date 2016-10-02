app.factory('ArFactory', function ($window) {
  let ArFactory = {}
  let prevLoc
  function diff (loc, prev) {
    return prev
      ? loc.coords.latitude - prev.coords.latitude > 0.0001 || loc.coords.longitude - prev.coords.longitude > 0.0001
      : true
  }
  function success (loc) {
    if (diff(loc, prevLoc)) {
      console.log('location changed!', loc)
      ArFactory.coords = loc.coords
      prevLoc = loc
    }
  }
  ArFactory.getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        let latitude = position.coords.latitude
        let longitude = position.coords.longitude
        resolve({latitude, longitude})
      }, () => {
        reject('We could not get your location.')
      })
    })
  }
  navigator.geolocation.watchPosition(success, console.warn, {enableHighAccuracy: true})
  return ArFactory
})
