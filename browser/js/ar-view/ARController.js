app.controller('ARController', function ($timeout, $rootScope, $window, $scope, $localStorage, $state, showAR, GameViewFactory, ArFactory, LocationWatcherFactory, EventFactory, currentUser, ModalFactory) {
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
    minZoom: 18,
    maxZoom: 18,
    maxNativeZoom: null,
    scrollWheelZoom: false,
    zoomControl: false,
    dragging: false,
    keyboard: false,
    attributionControl: false,
    center: {
      lat: 40.7047842,
      lng: -74.0092346,
      zoom: 18
    },
    tileLayer: 'https://api.mapbox.com/styles/v1/jyyeh/ciu1o4t2l00a92jo1o2qavws6/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoianl5ZWgiLCJhIjoiY2l1MW8zdWh2MGQ5MDMwandsMTh1cXlpbiJ9.MCJltxs97I_CAkTq2Z-n0g'
  }

  $scope.$on('updateAR', (event, data) => console.log(data))
  // toggles AR menu
  $scope.menuVisible = () => {
    ArFactory.showMenu()
  }

  // move clicked resource to user backpack
  $scope.$on('gameEvent', (event, data) => {
    let payload
    return EventFactory.createOrFindEvent(data)
      .then(event => {
        if (event.userId) {
          console.log('Already Found!')
        } else {
          console.log('Event has no user yet!')
          console.log('Received from AR: ', data)
          payload = {userId: currentUser.id, resourceInfo: data}
          $rootScope.socket.emit('sendBackpackEvent', payload)
        }
      })
  // TODO: this needs to go after event sequence has completed
  // also need to do error handling here...
  // return EventFactory.resourceToBackpack(data)
  //   .then(newBackpack => {
  //     console.log('new backpack: ', newBackpack)
  //   })
  //   .catch(console.log)
  })

  // takes player back to bunker view
  $scope.backToBunker = () => {
    $state.go('master.navbar.game')
  }

  // removes erroneous 'second' game view on page refresh
  $scope.$on('$destroy', () => {
    $scope.showAR = !$scope.showAR
  })

  // initialize watcher that executes callbacks to send all bunkers/positions of interest
  // if moved distance > some threshold - will send updated positions of interest
  // to Phaser AR-Canvas
  // LocationWatcherFactory.refresh()
  $scope.$on('PhaserReady', LocationWatcherFactory.watch)

  $scope.markers
  let zoom = 20
  $scope.center = {
    lat: 0,
    lng: 0,
    zoom: zoom
  }
  // LISTENERS
  // Need to modify this to its own controller - so that something else handles
  // all event related communication.
  // Needs to be removed later - ELIOT
  $rootScope.socket.emit('loading', currentUser)

  $rootScope.socket.on('send_metal', function (eventObj) {
    ModalFactory.addMessage(eventObj)
    if (ModalFactory.getMessages().length > 0) {
      ModalFactory.changeModal('message', {newContent: eventObj})
      // TODO: this is hacky - implement loading!
      $timeout(ModalFactory.openModal(), 1000)
    }
  })

  $rootScope.socket.on('send_electricity', function (eventObj) {
    ModalFactory.addMessage(eventObj)
    if (ModalFactory.getMessages().length > 0) {
      ModalFactory.changeModal('message', {newContent: eventObj})
      // TODO: this is hacky - implement loading!
      $timeout(ModalFactory.openModal(), 1000)
    }
  })

  $rootScope.socket.on('send_water', function (eventObj) {
    ModalFactory.addMessage(eventObj)
    if (ModalFactory.getMessages().length > 0) {
      ModalFactory.changeModal('message', {newContent: eventObj})
      // TODO: this is hacky - implement loading!
      $timeout(ModalFactory.openModal(), 1000)
    }
  })

  $rootScope.socket.on('send_air', function (eventObj) {
    ModalFactory.addMessage(eventObj)
    if (ModalFactory.getMessages().length > 0) {
      ModalFactory.changeModal('message', {newContent: eventObj})
      // TODO: this is hacky - implement loading!
      $timeout(ModalFactory.openModal(), 1000)
    }
  })
})
