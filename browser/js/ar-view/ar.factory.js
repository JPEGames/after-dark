app.factory('ArFactory', function ($window) {
  let ArFactory = {}
  let prevLoc
  let sensitivity = -100
  function diff (loc, prev) {
    return prev
      ? loc.coords.latitude - prev.coords.latitude > sensitivity || loc.coords.longitude - prev.coords.longitude > sensitivity
      : true
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
  ArFactory.makeLocationWatcher = function (func) {
    function success (loc) {
      if (diff(loc, prevLoc)) {
        func(loc)
        ArFactory.coords = loc.coords
        prevLoc = loc
      }
    }
    navigator.geolocation.watchPosition(success, console.warn, {enableHighAccuracy: true})
  }
  return ArFactory
})
