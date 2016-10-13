app.directive('upgradeRow', function ($state, ModalFactory) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/upgrades/upgrade-row.html',
    scope: {
      data: '='
    },
    link: function (scope) {}
  }
})
