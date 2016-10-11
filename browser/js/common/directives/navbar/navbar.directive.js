app.directive('navbar', function ($rootScope, Socket, ModalFactory, AuthService, AUTH_EVENTS, $state, GameViewFactory, FbFactory, CharacterFactory, BunkerStateFactory, NavbarFactory) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/directives/navbar/navbar.html',
    link: function (scope) {
      scope.hasCharacter = NavbarFactory.getter().hasCharacter
      scope.hasBunker = NavbarFactory.getter().hasBunker
      console.log('hasCharacter: ', scope.hasCharacter, 'hasBunker: ', scope.hasBunker)

      scope.items = [
        { label: 'Bunker', state: 'master.navbar.game', auth: true },
        { label: 'Wasteland', state: 'master.navbar.gamear', auth: true },
        { label: 'Account', state: 'master.navbar.signup-settings', auth: true },
        { label: 'Character Creation', state: 'master.navbar.characterCreate', auth: true },
        { label: 'Character Overview', state: 'master.navbar.characterOverview', auth: true },
        {label: 'Home', state: 'master.navbar.home', auth: true}
      ]

      // displaying in-game menu option in nav-bar
      scope.menuVisible = () => GameViewFactory.getMenuView()

      scope.user = null

      $rootScope.socket = Socket

      scope.isLoggedIn = function () {
        return AuthService.isAuthenticated()
      }

      scope.openInventory = function () {
        $('#myModal').modal('show')
      }

      scope.logout = function () {
        AuthService.logout().then(function () {
          // reset hasCharacter, hasBunker in NavbarFactory
          NavbarFactory.setter(false, false)
          $state.go('master', {}, {reload: true})
        })
      }

      var goToCharacterOverview = function () {
        $state.go('master.navbar.characterOverview')
      }

      var goToBunkerCreate = function () {
        $state.go('master.navbar.home')
      }
      $rootScope.socket.on('testing', function () {
        console.log('Got socket emit!')
      })
      var goToCharacterCreate = function () {
        $state.go('master.navbar.characterCreate')
      }

      var setUser = function () {
        AuthService.getLoggedInUser().then(function (user) {
          if (user) {
            scope.user = user
            // sending user information to backend!
            Socket.emit('loading', user)
            if (scope.hasCharacter && scope.hasBunker) {
              goToCharacterOverview()
            } else {
              if (scope.hasCharacter && !scope.hasBunker) {
                console.log('Going to bunker create in navbar!')
                goToBunkerCreate()
              } else {
                console.log('Going to character create in navbar!')
                goToCharacterCreate()
              }
            }
          }
        })
      }
      var removeUser = function () {
        scope.user = null
      }

      setUser()

      $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser)
      $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser)
      $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser)

      // SOCKET LISTENERS
      $rootScope.socket.on('test', function () {
        console.log('Got emit from backend communicate!')
        ModalFactory.openModal()
      })
    }

  }
})
