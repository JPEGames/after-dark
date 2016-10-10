app.directive('inventory', function ($state) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/inventory/inventory.html',
    // controller: 'InventoryController'
    scope: {
      inventory: '='
    }
  }
})
