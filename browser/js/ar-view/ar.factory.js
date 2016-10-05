app.factory('ArFactory', function (DistanceFactory) {
  let ArFactory = {}
  let prevLoc
  let showMenu = false

  ArFactory.showMenu = () => {
    showMenu = !showMenu
  }

  ArFactory.getMenuView = () => showMenu

  // promise for current location, resolves to {lat(type FLOAT), long(type FLOAT)}
  // currently only called when creating bunker initially
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

  return ArFactory
})
