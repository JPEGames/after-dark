app.factory('ArFactory', function (DistanceFactory) {
  let ArFactory = {}
  let prevLoc
  let showMenu = false

  ArFactory.showMenu = () => {
    showMenu = !showMenu
  }

  ArFactory.getMenuView = () => showMenu

  ArFactory.diff = (loc, prev, sensitivity = 0) => prev
    ? DistanceFactory.greaterThanXM(loc, prev, sensitivity)
    : true

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
  ArFactory.makeLocationWatcher = function (func, sensitivity = 0) {
    function success (geoObj) {
      let loc = {lat: geoObj.coords.latitude, lng: geoObj.coords.longitude}
      if (ArFactory.diff(loc, prevLoc, sensitivity)) {
        func(loc)
        ArFactory.coords = loc.coords
        prevLoc = loc
      }
    }
    navigator.geolocation.watchPosition(success, console.warn, {enableHighAccuracy: true})
  }
  return ArFactory
})
