app.factory('MenuFactory', function () {
  let MenuFactory = {}
  let floors = 0
  let savingBunker = false

  // adds in-game floors - called in GameController
  // on pressing Add Floor option in menu
  MenuFactory.addFloor = () => {
    floors++
  }

  // getter for floors - used in phaser object under scope.$watch
  // to physically add floors
  MenuFactory.getFloors = () => floors

  MenuFactory.saveBunkerState = () => {
    savingBunker = !savingBunker
  }

  MenuFactory.saving = () => savingBunker

  return MenuFactory
})
