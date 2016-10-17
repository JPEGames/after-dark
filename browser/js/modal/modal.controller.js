app.controller('ModalController', function ($scope, $interval, $rootScope, ModalFactory, NavbarFactory, CharOverFactory) {
  $scope.mode = 'inventory'
  $scope.default = 'inventory'
  $scope.castData = {}
  $scope.messages = ModalFactory.getMessages()
  $scope.upgrades = ModalFactory.getUpgrades()

  console.group('Modal Controller')
  CharOverFactory.resourceGenerator()
    .then(resources => {
      console.warn('RESOURCES: ', resources)
      // $scope.resources = resources
    })

  // LISTENING FOR FACTORY
  // Event driven modal. Only a few events right now.

  // <----- WILL UPDATE INVENTORY AFTER CLICKING ON RESOURCES ---->
  $scope.$on('updateInventory', function (event, data) {
    console.log('updating inventory!!!')
    let newInventory = []
    for (let resource in data) {
      newInventory.push(data[ resource ])
    }
    // this gets passed into modal.html (inventory directive)
    $scope.resources = newInventory
    console.log('SCOPE RESOURCES: ', $scope.resources)
  })

  // I want to change what 'mode' the modal is portraying at given moment.
  // A queue manager will have to handle this event.
  $scope.$on('modeChange', function (event, data) {
    $scope.mode = data.newMode
    console.log('Detected Change!')
    console.log('Mode is now: ', $scope.mode)
    if (data) {
      // TODO: THIS WAS ADDED TO MODIFY CAST DATA STUFF
      // originally should just be $scope.mode = data.newMode, $scope.castData = data.newContent
      $scope.castData = data.newContent
      console.log('DATA: ', data)
      if (data.forceOpen) {
        if (data.newContent.forceEventType) {
          console.log('Forcing Event Type')
          $scope.mode = data.newContent.forceEventType
          console.log('Mode forced to: ', $scope.mode)
        }
        console.log('Modal Open forced by Modal Change.')
        $interval(ModalFactory.openModal, 10, 1)
      }
    }
  })

  // Set the modal back to its default in 1 second (currently, inventory)
  $scope.$on('modeReset', function (event, data) {
    if (!data) {
      resetVars()
    } else {
      $interval(resetVars, 1000, 1)
    }
  })

  // Kind of ridiculous - but just for visual cue - mark message read and remove
  // from front end. Will obvisouly require promises
  $scope.$on('messageRead', function (event, aMessage) {
    // TODO: THIS WAS ADDED TO MODIFY CAST DATA STUFF
    // $scope.castData = null
    ModalFactory.deleteMessage(aMessage)
    $scope.messages = ModalFactory.getMessages()
  })

  $scope.$on('startLoad', function (event, loadData) {
    $scope.mode = 'loading'
    $scope.castData = loadData
  })

  // for clearing inventory upon depositing resources!
  $scope.$on('clearInventory', function (event, data) {
    console.log('Clearing inventory!')
    $scope.resources.forEach(resource => {
      resource.pquantity = 0
      resource.myProgress = { 'width': 0 + '%' }
    })
  })

  function resetVars () {
    $scope.mode = $scope.default
    $scope.castData = {}
    console.log('Reset Modal.')
  }

  // Dummy inv objects - notice ng-style obj at end
  $scope.resources = [
    {
      title: 'Metal',
      source: '/pimages/metal.png',
      pquantity: 0,
      pmax: 100,
      bquantity: 0,
      bmax: 100,
      myProgress: { 'width': 0 + '%' }
    },
    {
      title: 'H2O',
      source: '/pimages/water.png',
      pquantity: 0,
      pmax: 100,
      bquantity: 0,
      bmax: 100,
      myProgress: { 'width': 0 + '%' }
    },
    {
      title: 'O2',
      source: '/pimages/air.png',
      pquantity: 0,
      pmax: 100,
      bquantity: 0,
      bmax: 100,
      myProgress: { 'width': 0 + '%' }
    },
    {
      title: 'Electricity',
      source: '/pimages/electricity.png',
      pquantity: 0,
      pmax: 100,
      bquantity: 0,
      bmax: 100,
      myProgress: { 'width': 0 + '%' }
    }
  ]
  // Force modal open if there are things to say.
  // if ($scope.messages.length > 0) {
  //   ModalFactory.openModal()
  // }
  console.groupEnd('Modal Controller')
})
