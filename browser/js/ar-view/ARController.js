app.controller('ARController', function ($scope, $localStorage, $state, showAR, GameViewFactory, leafletData, ArFactory) {
  // display game upon transition to game view
  $scope.showAR = showAR

  // show AR menu
  $scope.showMenu = () => {
    let retVal = ArFactory.getMenuView()
    if (!retVal) {
      $scope.$broadcast('resume')
    } else {
      $scope.$broadcast('pause')
    }
    return retVal
  }

  // So these are the map things - they will likely need their own factory.
  // maxBounds takes a northeast and southwest point and does not allow dragging outside of it.

  $scope.defaults = {
    scrollWheelZoom: false,
    zoomControl: false,
    dragging: false,
    keyboard: false,
    center: {
      lat: 40.7047842,
      lng: -74.0092346,
      zoom: 18
    }
  }

  // toggles AR menu
  $scope.menuVisible = () => {
    ArFactory.showMenu()
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
  let zoom = 20
  $scope.center = {
    lat: 0,
    lng: 0,
    zoom: zoom
  }
})
