app.factory('ArFactory', function (DistanceFactory) {
  let ArFactory = {}
  let prevLoc
  let showMenu = false

  ArFactory.showMenu = () => {
    showMenu = !showMenu
  }

  ArFactory.getMenuView = () => showMenu

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
