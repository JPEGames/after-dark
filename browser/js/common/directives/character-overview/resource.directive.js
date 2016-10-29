app.directive('resources', function () {
  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/character-overview/resource.html',
    scope: {
      resource: '='
    },
    link: function () {}
  }
})
