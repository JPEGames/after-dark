app.controller('ARController', function ($window, $scope, $localStorage, $state, showAR, GameViewFactory, ArFactory, LocationWatcherFactory) {
  // display game upon transition to game view
  $scope.mapHeight = $window.innerHeight
  $scope.mapWidth = $window.innerWidth
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

  $scope.$on('updateAR', (event, data) => console.log(data))
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
  LocationWatcherFactory.watch()

  $scope.markers
  let zoom = 20
  $scope.center = {
    lat: 0,
    lng: 0,
    zoom: zoom
  }
})
