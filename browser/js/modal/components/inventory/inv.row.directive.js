app.directive('invRow', function ($state) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/inventory/inv-row.html',
    scope: {
      data: '='
    }
  }
})
