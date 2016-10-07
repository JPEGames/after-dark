app.directive('navbar', function ($rootScope, Socket, AuthService, AUTH_EVENTS, $state, GameViewFactory, FbFactory) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/directives/navbar/navbar.html',
    link: function (scope) {
      scope.items = [
        {label: 'Bunker', state: 'master.navbar.game', auth: true},
        {label: 'Wasteland', state: 'master.navbar.gamear', auth: true},
        {label: 'Account', state: 'master.navbar.signup-settings', auth: true},
        {label: 'Character Creation', state: 'master.navbar.characterCreate', auth: true},
        {label: 'Character Overview', state: 'master.navbar.characterOverview', auth: true}
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
          let strUserId = user.id.toString()
          // get game state associated with user
          // GameViewFactory.getUserState()
          // TODO: This isn't secure at all! Use Firebase Auth?
          FbFactory.getFirebaseRef().child('users').once('value')
            .then(snapshot => {
              // if user isn't in firebase db yet, add him/her
              if (!Object.keys(snapshot.val()).includes(strUserId)) {
                console.log('setting up user in database!')
                FbFactory.getFirebaseRef().child(`users/${user.id}`).set({
                  email: user.email,
                  Location: 'here'
                })
              }
            })
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
