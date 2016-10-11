app.controller('ModalController', function ($scope, $interval, $rootScope, ModalFactory) {
  $scope.mode = 'notify'
  $scope.default = 'inventory'
  $scope.castData = {}

  // LISTENING FOR FACTORY
  // Event driven modal. Only a few events right now.

  // I want to change what 'mode' the modal is portraying at given moment. 
  // A queue manager will have to handle this event.
  $scope.$on('modeChange', function (event, data) {
    $scope.mode = data.newMode
    console.log('Detected Change!')
    if (data) {
      $scope.castData = data.newContent
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
    let indexToRemove = null
    $scope.messages.forEach(function (mes, index) {
      if (mes.id === aMessage.id) {
        indexToRemove = index
      }
    })
    if (indexToRemove !== null) {
      $scope.messages.splice(indexToRemove, 1)
      console.log('Removed Message!')
    } else {
      console.log('Could not find message to remove.')
      console.log(aMessage)
    }
  })

  function resetVars () {
    $scope.mode = $scope.default
    $scope.castData = {}
    console.log('Reset Modal.')
  }

  // Dummy inv objects - notice ng-style obj at end
  $scope.resources = [
    {title: 'Metal', source: '/pimages/ore.png', pquantity: 0, pmax: 100, bquantity: 0, bmax: 100, myProgress: {'width': 0 + '%'}},
    {title: 'H2O', source: '/pimages/water.png', pquantity: 0, pmax: 100, bquantity: 0, bmax: 100, myProgress: {'width': 0 + '%'}},
    {title: 'O2', source: '/pimages/oxygen.png', pquantity: 0, pmax: 100, bquantity: 0, bmax: 100, myProgress: {'width': 0 + '%'}},
    {title: 'Electricity', source: '/pimages/electricity.png', pquantity: 0, pmax: 100, bquantity: 0, bmax: 100, myProgress: {'width': 0 + '%'}}
  ]

  // Dummy message objects
  $scope.messages = [
    {
      title: 'An Event',
      description: 'Something somewhere happened to someone.',
      eventType: 'confirm',
      source: '/pimages/message.png',
      type: 'general',
      id: 1,
      status: 'neutral'
    },
    {
      title: 'Another Event',
      description: 'Something somewhere happened to someone else!',
      eventType: 'yes/no',
      source: '/pimages/message.png',
      type: 'general',
      id: 2,
      status: 'danger'
    },
    {
      title: 'Metal Found',
      description: 'You gathered some metal.',
      quantity: 17,
      eventType: 'confirm',
      id: 3,
      type: 'resource',
      source: '/pimages/ore.png',
      status: 'success'
    }
  ]

  // Force modal open if there are things to say.
  if ($scope.messages.length > 0) {
    ModalFactory.openModal()
  }
})
