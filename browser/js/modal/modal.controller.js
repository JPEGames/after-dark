app.controller('ModalController', function ($scope, $interval, $rootScope, ModalFactory) {
  $scope.mode = 'notify'
  $scope.default = 'inventory'
  $scope.castData = {}

  // LISTENING FOR FACTORY
  $scope.$on('modeChange', function (event, data) {
    $scope.mode = data.newMode
    console.log('Detected Change!')
    if (data) {
      $scope.castData = data.newContent
    }
  })

  $scope.$on('modeReset', function () {
    $interval(resetVars, 1000, 1)
  })

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

  $scope.resources = [
    {title: 'Metal', source: '/pimages/ore.png', pquantity: 0, pmax: 100, bquantity: 0, bmax: 100, myProgress: {'width': 0 + '%'}},
    {title: 'H2O', source: '/pimages/water.png', pquantity: 0, pmax: 100, bquantity: 0, bmax: 100, myProgress: {'width': 0 + '%'}},
    {title: 'O2', source: '/pimages/oxygen.png', pquantity: 0, pmax: 100, bquantity: 0, bmax: 100, myProgress: {'width': 0 + '%'}},
    {title: 'Electricity', source: '/pimages/electricity.png', pquantity: 0, pmax: 100, bquantity: 0, bmax: 100, myProgress: {'width': 0 + '%'}}
  ]

  $scope.messages = [
    {
      title: 'An Event',
      description: 'Something somewhere happened to someone.',
      eventType: 'confirm',
      source: '/pimages/message.png',
      id: 1
    },
    {
      title: 'Another Event',
      description: 'Something somewhere happened to someone else!',
      eventType: 'yes/no',
      source: '/pimages/message.png',
      id: 2
    }
  ]

  if ($scope.messages.length > 0) {
    ModalFactory.openModal()
  }
})
