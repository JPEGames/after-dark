app.controller('ARController', function ($scope, $localStorage, $state, showAR, ARFactory) {
  // display game upon transition to AR view
  $scope.showAR = showAR

  // show AR menu
  $scope.showMenu = () => {
    let retVal = ARFactory.getMenuView()
    if (!retVal) {
      $scope.$broadcast('resume')
    } else {
      $scope.$broadcast('pause')
    }
    return retVal
  }

  // toggles AR menu
  $scope.menuVisible = () => {
    ARFactory.showMenu()
  }

  // takes player back to bunker view
  $scope.backToBunker = () => {
    $state.go('master.navbar.game')
  }

  // removes erroneous 'second' game view on page refresh
  $scope.$on('$destroy', () => {
    $scope.showAR = !$scope.showAR
  })
})
