app.controller('ARController', function ($scope, $localStorage, $state, showAR, GameViewFactory, leafletData, ArFactory, GeoFireFactory) {
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
  ArFactory.makeLocationWatcher(doThisOnWatch)
  function doThisOnWatch (geoObj) {
    mapMover(geoObj)
      .then(bounds => getBunkers(geoObj, bounds))
  }
  function mapMover (geoObj) {
    return leafletData.getMap()
      .then(map => map.panTo({lat: geoObj.coords.latitude, lng: geoObj.coords.longitude}))
      .then(map => map.getBounds())
  }
  function getBunkers (geoObj, bounds) {
    let query = GeoFireFactory.query({
      center: [geoObj.coords.latitude, geoObj.coords.longitude],
      radius: 1
    })
    query.on('key_entered', makeFormatter(bounds))
  }
  function makeFormatter (bounds) {
    let ne = bounds._northEast
    let sw = bounds._southWest
    let nw = {lat: ne.lat, lng: sw.lng}
    let se = {lat: sw.lat, lng: ne.lng}
    let size = getLatLngDiff(nw, se)
    return function makeUseAbleData (id, latlng, dist) {
      let [lat, lng] = latlng
      latlng = {lat, lng}
      let obj = {id, pos: toXY(size, getLatLngDiff(nw, latlng))}
      return obj
    }
  }
  function getLatLngDiff (a, b) {
    return {h: a.lat - b.lat, w: a.lng - b.lng}
  }
  function toXY (map, point) {
    return {x: point.w / map.w, y: point.h / map.h}
  }
  $scope.markers
  let zoom = 20
  $scope.center = {
    lat: 0,
    lng: 0,
    zoom: zoom
  }
})
