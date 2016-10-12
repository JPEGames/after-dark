app.directive('load', function ($state, ModalFactory) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/load/load.html',
    // controller: 'LoadController',
    scope: {
      loading: '='
    },
    link: function (scope) {}
  }
})
