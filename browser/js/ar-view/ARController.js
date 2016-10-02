app.controller('ARController', function ($scope, $localStorage, $state, showAR, GameViewFactory, leafletData, ArFactory) {
  // display game upon transition to game view
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
