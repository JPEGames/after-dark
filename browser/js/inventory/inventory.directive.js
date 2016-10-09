app.directive('inventory', function ($state) {
  return {
    restrict: 'E',
    templateUrl: 'js/inventory/inventory.html',
    controller: 'InventoryController'
  }
})
