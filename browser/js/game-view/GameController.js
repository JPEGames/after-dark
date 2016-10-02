app.controller('GameController', function ($scope, $localStorage, showGame, GameViewFactory, MenuFactory, bunkerState, FbFactory) {
  // display game upon transition to game view
  $scope.showGame = showGame

  $scope.bunkerState = bunkerState

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
    MenuFactory.toggleBunkerSave()
  }

  // TODO: not being used right now!
  $scope.totalFloors = () => MenuFactory.getFloors()

  // save bunker state from in-game menu
  $scope.saveBunker = () => {
    MenuFactory.toggleBunkerSave()
  }

  // useful for testing save/load
  $scope.clearBunker = () => {
    $scope.$broadcast('clearing')
  }

  // removes erroneous 'second' game view on page refresh
  $scope.$on('$destroy', () => {
    $scope.showGame = !$scope.showGame
  })
  console.log('FIREBASE WOO: ', FbFactory.getFirebaseRef())
})
