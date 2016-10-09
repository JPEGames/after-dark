app.directive('invRow', function ($state) {
  return {
    restrict: 'E',
    templateUrl: 'js/inventory/inv-row.html',
    scope: {
      data: '='
    }
  }
})
