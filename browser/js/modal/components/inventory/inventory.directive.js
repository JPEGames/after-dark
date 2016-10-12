app.directive('inventory', function ($state, ModalFactory) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/inventory/inventory.html',
    // controller: 'InventoryController'
    scope: {
      inventory: '='
    },
    link: function (scope) {
      scope.closeInventory = function () {
        ModalFactory.closeModal()
      }
    }
  }
})
