app.controller('ModalController', function ($scope) {
  $scope.resources = [
    {title: 'Metal', source: '/pimages/ore.png', pquantity: 0, pmax: 100, bquantity: 0, bmax: 100, myProgress: {'width': 0 + '%'}},
    {title: 'H2O', source: '/pimages/water.png', pquantity: 0, pmax: 100, bquantity: 0, bmax: 100, myProgress: {'width': 0 + '%'}},
    {title: 'O2', source: '/pimages/oxygen.png', pquantity: 0, pmax: 100, bquantity: 0, bmax: 100, myProgress: {'width': 0 + '%'}},
    {title: 'Electricity', source: '/pimages/electricity.png', pquantity: 0, pmax: 100, bquantity: 0, bmax: 100, myProgress: {'width': 0 + '%'}}
  ]

  /*
My thoughts:
We need to change this to different types of events.
The below is all about visuals specifically. I will make functions to correspond to
certain visual elements actions.
  */
  $scope.mode = 'inventory'

  $scope.title = 'An Event'

  $scope.description = 'You activated an event! Heres what happened.'

  $scope.eventType = 'confirm'
})
