app.directive('characterOverview', function (AuthService, NavbarFactory, $state, $rootScope, CharOverFactory) {
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

      scope.myStats = CharOverFactory.getStats()
      console.log('myStats', scope.myStats)

      NavbarFactory.setter(true, true)
      console.log('Forced hamburger menu to comply.')
    }
  }
})
