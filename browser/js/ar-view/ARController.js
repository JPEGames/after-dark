app.controller('ARController', function ($scope, $localStorage, showAR, GameViewFactory, leafletData, ArFactory) {
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

  // map stuff
  ArFactory.makeLocationWatcher(mapMover)
  function mapMover (geoObj) {
    leafletData.getMap()
      .then(map => {
        console.log('panning map')
        map.panTo({lat: geoObj.coords.latitude, lng: geoObj.coords.longitude})
      })
  }
  let zoom = 30
  $scope.center = {
    lat: 0,
    lng: -71,
    zoom: zoom
  }
})
