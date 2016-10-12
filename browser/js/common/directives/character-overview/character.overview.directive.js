app.directive('characterOverview', function (AuthService, $state, $rootScope) {
  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/character-overview/char-dir-overview.html',
    link: function (scope) {
      // Needs to be removed later - ELIOT
      AuthService.getLoggedInUser()
        .then(function (user) {
          $rootScope.socket.emit('loading', user)
        })
    }
  }
})
