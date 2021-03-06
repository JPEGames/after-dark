app.factory('ArFactory', function (DistanceFactory) {
  let ArFactory = {}
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
        let lat = position.coords.latitude
        let lng = position.coords.longitude
        resolve({lat, lng})
      }, () => {
        console.log('POSITION ERROR')
        reject('We could not get your location.')
      }, {
        enableHighAccuracy: true,
        timeout: 10000
      })
    })
  }

  return ArFactory
})
