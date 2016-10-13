app.directive('upgrades', function ($state) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/upgrades/upgrades.html',
    controller: 'UpgradesController',
    scope: {
      upgrades: '='
    }
  }
})
