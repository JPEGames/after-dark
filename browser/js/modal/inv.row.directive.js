app.directive('invRow', function ($state) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/inv-row.html',
    scope: {
      data: '='
    }
  }
})
