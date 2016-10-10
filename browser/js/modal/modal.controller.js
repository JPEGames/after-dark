app.controller('ModalController', function ($scope, $interval) {
  $scope.mode = 'notify'
  $scope.default = 'inventory'
  $scope.castData = {}

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
      source: '/pimages/message.png'
    },
    {
      title: 'Another Event',
      description: 'Something somewhere happened to someone else!',
      eventType: 'yes/no',
      source: '/pimages/message.png'
    }
  ]
})
