app.directive('navbar', function ($rootScope, Socket, AuthService, AUTH_EVENTS, $state, GameViewFactory) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/directives/navbar/navbar.html',
    link: function (scope) {
      scope.items = [
        {label: 'Bunker', state: 'master.navbar.game', auth: true},
        {label: 'Wasteland', state: 'master.navbar.gamear', auth: true},
        {label: 'Account', state: 'master.navbar.signup-settings', auth: true}
      ]

      // displaying in-game menu option in nav-bar
      scope.menuVisible = () => GameViewFactory.getMenuView()

      scope.user = null

      $rootScope.socket = Socket

      scope.isLoggedIn = function () {
        return AuthService.isAuthenticated()
      }

      scope.logout = function () {
        AuthService.logout().then(function () {
          $state.go('master.navbar.home')
        })
      }

      var setUser = function () {
        AuthService.getLoggedInUser().then(function (user) {
          scope.user = user
          // get game state associated with user
          GameViewFactory.getUserState()
        })
      }

      var removeUser = function () {
        scope.user = null
      }

      setUser()

      $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser)
      $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser)
      $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser)
    }

  }
})
