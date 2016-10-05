app.factory('MenuFactory', function ($http, AuthService) {
  let MenuFactory = {}
  let floors = 1
  let savingBunker = false

  // adds in-game floors - called in GameController
  // on pressing Add Floor option in menu
  MenuFactory.addFloor = () => {
    floors += 1
  }

  MenuFactory.setFloors = (floorNum) => {
    floors = floorNum
  }

  // getter for floors - used in phaser object under scope.$watch
  // to physically add floors
  MenuFactory.getFloors = () => floors

  MenuFactory.toggleBunkerSave = () => {
    savingBunker = !savingBunker
  }

  // this value (boolean) is watched inside of bunker game, will only save if true
  MenuFactory.saving = () => savingBunker

  // saves bunker for logged-in user upon upgrading/literal saving
  MenuFactory.saveBunker = bunkerState => {
    return AuthService.getLoggedInUser()
      .then(currentUser => {
        return $http.put(`/api/bunkerstate/${currentUser.id}`, bunkerState).then(r => r.data)
      })
  }

  return MenuFactory
})
