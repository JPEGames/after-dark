app.controller('GameController', function ($scope, $localStorage, showGame, GameViewFactory, MenuFactory) {
  // display game upon transition to game view
  $scope.showGame = showGame

  // show in-game menu on clicking Menu option in nav-bar
  $scope.showMenu = () => {
    let retVal = GameViewFactory.getMenuView()
    if (!retVal) {
      $scope.$broadcast('resume')
    } else {
      $scope.$broadcast('pause')
    }
    return retVal
  }

  $scope.addFloor = () => {
    MenuFactory.addFloor()
  }

  $scope.totalFloors = () => MenuFactory.getFloors()

  // removes erroneous 'second' game view on page refresh
  $scope.$on('$destroy', () => {
    $scope.showGame = !$scope.showGame
  })
})
