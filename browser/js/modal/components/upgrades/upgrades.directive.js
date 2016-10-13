app.directive('upgrades', function ($state, ModalFactory) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/upgrades/upgrades.html',
    controller: 'UpgradesController',
    scope: {
      upgrades: '='
    },
    link: function (scope) {
      scope.closeUpgrades = function () {
        ModalFactory.resetModal()
        ModalFactory.closeModal()
      }
    }
  }
})
