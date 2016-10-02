app.controller('ARController', function ($scope, $localStorage, showAR, GameViewFactory, ArFactory) {
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
  let zoom = 6
  ArFactory.getCurrentPosition().then(coords => {
    $scope.playerLoc = {
      lat: coords.latitude,
      lng: coords.longitude,
      zoom: zoom
    }
  })
  $scope.initPos = {
    lat: 42,
    lng: -71,
    zoom: zoom
  }
// $scope.playerLoc = {
//   lat: ArFactory.coords.latitude,
//   lng: ArFactory.coords.longitude,
//   zoom: zoom
// }
})
