app.factory('MenuFactory', function () {
  let MenuFactory = {}
  let floors = 0

  // adds in-game floors - called in GameController
  // on pressing Add Floor option in menu
  MenuFactory.addFloor = () => {
    floors++
  }

  // getter for floors - used in phaser object under scope.$watch
  // to physically add floors
  MenuFactory.getFloors = () => floors

  return MenuFactory
})
