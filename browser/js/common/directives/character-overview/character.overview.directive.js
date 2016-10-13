app.directive('characterOverview', function (AuthService, $state, $rootScope) {
  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/character-overview/char-dir-overview.html',
    link: function (scope) {
      scope.myUsername
      // Needs to be removed later - ELIOT
      AuthService.getLoggedInUser()
        .then(function (user) {
          scope.myUsername = user.username
          $rootScope.socket.emit('loading', user)
        })
    }
  }
})
