app.controller('ModalController', function ($scope, $interval, $rootScope, ModalFactory, NavbarFactory, CharOverFactory) {
  $scope.mode = 'inventory'
  $scope.default = 'inventory'
  $scope.castData = {}
  $scope.messages = ModalFactory.getMessages()
  $scope.upgrades = ModalFactory.getUpgrades()

  CharOverFactory.resourceGenerator()
    .then(resources => {
      console.warn('RESOURCES after state change: ', resources)
      $scope.resources = resources
    })

  // LISTENING FOR FACTORY
    // Event driven modal. Only a few events right now.

  // <----- WILL UPDATE INVENTORY AFTER CLICKING ON RESOURCES ---->
  $scope.$on('updateInventory', function (event, data) {
    let newInventory = []
    for (let resource in data) {
      newInventory.push(data[ resource ])
    }
    // this gets passed into modal.html (inventory directive)
    $scope.resources = newInventory
    console.log('$scope.resources after backpack update: ', $scope.resources)
  })

  // I want to change what 'mode' the modal is portraying at given moment.
  // A queue manager will have to handle this event.
  $scope.$on('modeChange', function (event, data) {
    let tempLength = 0
    for (let keys in $scope.castData) {
      if ($scope.castData.hasOwnProperty(keys)) {
        tempLength++
      }
    }

    console.log('castData keys - ' + tempLength)
    // If I am already in a mode, and get information about the next mode, what occurs here?
    if (tempLength > 0 && $scope.mode !== 'loading') {
      // This would mean that castData has not been dealt with:
      // 1. Add this data as a new message in the factory.
      // 2. Make sure getMessages is operating properly.
      // 3. Ensure that the loading mode does not get in the way of accepting a new message.
      console.log('Detected unresolved castData, adding message onto event queue.')
      // Store the mode that this event requested.
      if (data) {
        console.log('Next Message: ', data.newContent)
        console.log('Unresolved message: ', $scope.castData)
        data.newContent.nextMode = data.newMode
        ModalFactory.addMessage(data.newContent)
      }
    } else {
      $scope.mode = data.newMode
      console.log('Detected Change!')
      console.log('Mode is now: ', $scope.mode)
      if (data) {
        $scope.castData = data.newContent
        console.log('DATA: ', data)
        if (data.forceOpen) {
          console.log('Modal Open forced by Modal Change.')
          $interval(ModalFactory.openModal, 10, 1)
        }
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
    $scope.castData = {}
    $scope.messages = ModalFactory.getMessages()
    if ($scope.messages.length > 0) {
      console.error('ABOUT TO DELETE: ', aMessage)
      ModalFactory.deleteMessage(aMessage)
      $scope.messages = ModalFactory.getMessages()
    } else {
      $scope.messages = ModalFactory.getMessages()
    }
  })

  $scope.$on('startLoad', function (event, loadData) {
    $scope.mode = 'loading'
    // Loading counts as cast data...
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
      title: 'Water',
      source: '/pimages/water.png',
      pquantity: 0,
      pmax: 100,
      bquantity: 0,
      bmax: 100,
      myProgress: { 'width': 0 + '%' }
    },
    {
      title: 'Air',
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
})
