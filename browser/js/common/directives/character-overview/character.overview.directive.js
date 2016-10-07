app.directive('characterOverview', function (AuthService, $state) {
  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/character-overview/char-dir-overview.html'
  }
})
