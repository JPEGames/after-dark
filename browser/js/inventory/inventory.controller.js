app.controller('InventoryController', function ($scope) {
  $scope.resources = [
    {title: 'Metal', source: '/pimages/ore.png', quantity: 0, max: 100},
    {title: 'H2O', source: '/pimages/water.png', quantity: 0, max: 100},
    {title: 'O2', source: '/pimages/oxygen.png', quantity: 0, max: 100},
    {title: 'Electricity', source: '/pimages/electricity.png', quantity: 0, max: 100}
  ]
})
