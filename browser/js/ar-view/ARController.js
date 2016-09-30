app.controller('ARController', function ($scope, $localStorage, showAR, GameViewFactory) {
  // display game upon transition to game view
  $scope.showAR = showAR

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

  // removes erroneous 'second' game view on page refresh
  $scope.$on('$destroy', () => {
    $scope.showAR = !$scope.showAR
  })
})
