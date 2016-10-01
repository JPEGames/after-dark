app.controller('GameController', function ($scope, $localStorage, showGame, GameViewFactory, MenuFactory) {
  // display game upon transition to game view
  $scope.showGame = showGame

  // toggle value for showing in-game menu + game pause && vice-versa
  $scope.showMenu = () => {
    let retVal = GameViewFactory.getMenuView()
    if (!retVal) {
      $scope.$broadcast('resume')
    } else {
      $scope.$broadcast('pause')
    }
    return retVal
  }

  // toggles bunker menu
  $scope.menuVisible = () => {
    GameViewFactory.showMenu()
  }

  // add floors from in-game menu
  $scope.addFloor = () => {
    MenuFactory.addFloor()
  }

  $scope.totalFloors = () => MenuFactory.getFloors()

  // save bunker state from in-game menu
  $scope.saveBunker = () => {
    MenuFactory.toggleBunkerSave()
  }

  // removes erroneous 'second' game view on page refresh
  $scope.$on('$destroy', () => {
    $scope.showGame = !$scope.showGame
  })
})
