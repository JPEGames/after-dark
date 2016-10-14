app.controller('ARController', function ($timeout, $rootScope, $window, $scope, $localStorage, $state, showAR, GameViewFactory, ArFactory, LocationWatcherFactory, EventFactory, currentUser, ModalFactory, BunkerStateFactory) {
  let templateObjs = {
    'metal': {
      title: 'Metal',
      source: '/pimages/ore.png',
      pquantity: 0,
      pmax: 100,
      bquantity: 0,
      bmax: 100,
      myProgress: { 'width': 0 + '%' }
    },
    'water': {
      title: 'H2O',
      source: '/pimages/water.png',
      pquantity: 0,
      pmax: 100,
      bquantity: 0,
      bmax: 100,
      myProgress: { 'width': 0 + '%' }
    },
    'air': {
      title: 'O2',
      source: '/pimages/oxygen.png',
      pquantity: 0,
      pmax: 100,
      bquantity: 0,
      bmax: 100,
      myProgress: { 'width': 0 + '%' }
    },
    'electricity': {
      title: 'Electricity',
      source: '/pimages/electricity.png',
      pquantity: 0,
      pmax: 100,
      bquantity: 0,
      bmax: 100,
      myProgress: { 'width': 0 + '%' }
    }
  }

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

  // toggles AR menu
  $scope.menuVisible = () => {
    ArFactory.showMenu()
  }

  // move clicked resource to user backpack
  $scope.$on('gameEvent', (event, data) => {
    let payload
    console.log('received data: ', data)
    console.log('current user: ', currentUser)
    if (data[ 'type' ] === 'bunker') {
      BunkerStateFactory.getBunkerUser(data.id)
        .then(bunkerUser => {
          if (bunkerUser === currentUser.username) {
            ModalFactory.enterBunker()
            ModalFactory.changeModal('message', {
              newContent: {
                title: `Enter ${currentUser.username}'s Bunker?`,
                description: `You have arrived at your own bunker. Thankfully, still safe. Would you like to enter your bunker at the present moment?`,
                eventType: 'yes/no',
                source: '/pimages/vault.png',
                type: 'general',
                id: '10',
                status: 'neutral',
                exitType: 'load',
                next: currentUser.username
              }
            })
            ModalFactory.openModal()
            // $state.go('master.navbar.game')
          }
        })
    } else {
      return EventFactory.createOrFindEvent(data)
        .then(event => {
          if (event.userId) {
            console.log('Already Found!')
          } else {
            console.log('Event has no user yet!')
            console.log('Received from AR: ', data)
            payload = { userId: currentUser.id, resourceInfo: data }
            $rootScope.socket.emit('sendBackpackEvent', payload)
          }
        })
    }

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
  $scope.$on('fight', function (event, data) {
    console.log('Got fight event from Phaser!', 'data: ', data)
    let payload = {userId: currentUser.id, type: data.type, dangerLvl: data.dangerLvl}
    let thisMarker = { id: data.id, type: data.type }
    console.log('fight payload: ', payload)
    $rootScope.socket.emit('fight', payload)
    // this is useful for deleting the rat marker!
    ModalFactory.setMarker(thisMarker)
  })

  // LISTENERS
  // Need to modify this to its own controller - so that something else handles
  // all event related communication.
  // Needs to be removed later - ELIOT
  $rootScope.socket.emit('loading', currentUser)

  $rootScope.socket.on('send_metal', function (event) {
    let eventObj = event.event
    let thisMarker = { id: event.markerId, type: event.markerType }
    console.log('THIS MARKER: ', thisMarker)
    ModalFactory.addMessage(eventObj)
    if (ModalFactory.getMessages().length > 0) {
      console.log('EVENT OBJECT TO DISPLAY: ', eventObj)
      ModalFactory.changeModal('message', { newContent: eventObj })
      // TODO: this is hacky - implement loading!
      $timeout(ModalFactory.openModal(), 1000)
      ModalFactory.setMarker(thisMarker)
    }
  })

  $rootScope.socket.on('send_electricity', function (event) {
    let eventObj = event.event
    console.log('EVENT OBJECT: ', eventObj)
    let thisMarker = { id: event.markerId, type: event.markerType }
    console.log('THIS MARKER: ', thisMarker)
    ModalFactory.addMessage(eventObj)
    if (ModalFactory.getMessages().length > 0) {
      console.log('EVENT OBJECT TO DISPLAY: ', eventObj)
      ModalFactory.changeModal('message', { newContent: eventObj })
      // TODO: this is hacky - implement loading!
      $timeout(ModalFactory.openModal(), 1000)
      ModalFactory.setMarker(thisMarker)
    }
  })

  $rootScope.socket.on('send_water', function (event) {
    let eventObj = event.event
    let thisMarker = { id: event.markerId, type: event.markerType }
    ModalFactory.addMessage(eventObj)
    if (ModalFactory.getMessages().length > 0) {
      ModalFactory.changeModal('message', { newContent: eventObj })
      // TODO: this is hacky - implement loading!
      $timeout(ModalFactory.openModal(), 1000)
      ModalFactory.setMarker(thisMarker)
    }
  })

  $rootScope.socket.on('send_air', function (event) {
    let eventObj = event.event
    let thisMarker = { id: event.markerId, type: event.markerType }
    ModalFactory.addMessage(eventObj)
    if (ModalFactory.getMessages().length > 0) {
      ModalFactory.changeModal('message', { newContent: eventObj })
      // TODO: this is hacky - implement loading!
      $timeout(ModalFactory.openModal(), 1000)
      ModalFactory.setMarker(thisMarker)
    }
  })

  $rootScope.socket.on('updateBackpack', function (event) {
    console.log('GOT UPDATE BACKPACK EVENT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    EventFactory.getBackpack()
      .then(userBackpack => {
        console.log('USER BACKPACK AFTER SOCKET EMIT: ', userBackpack)
        for (let resource in templateObjs) {
          templateObjs[ resource ][ 'pquantity' ] = userBackpack[ resource ]
          templateObjs[ resource ][ 'myProgress' ] = {'width': templateObjs[ resource ][ 'pquantity' ] / templateObjs[ resource ][ 'pmax' ] * 100 + '%'}
          console.log('RESOURCE: ', resource, 'QUANTITY: ', templateObjs[ resource ][ 'pquantity' ])
        }
        ModalFactory.updateInventory(templateObjs)
      })
  })

  // <-------- LISTENER FOR EVENT CHAIN RESPONSES -------->
  $rootScope.socket.on('serverRes', function (eventObj) {
    console.log('Got server response!~~~~~~~~~~~~~~~~~~~~~~~', eventObj)
    ModalFactory.changeModal('message', { newContent: eventObj, forceOpen: true })
    // ModalFactory.setMarker()
  })
})
