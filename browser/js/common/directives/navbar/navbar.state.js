app.config(function ($stateProvider) {
  $stateProvider.state('master.navbar', {
    templateUrl: 'js/common/directives/navbar/navbar-state.html',
    controller: 'NavbarController',
    resolve: {
      hasCharacter: function (AuthService, CharacterFactory) {
        return AuthService.getLoggedInUser()
          .then(user => {
            if (user) {
              return CharacterFactory.getCharacter()
            } else {
              console.log('NO CHARACTER IN RESOLVE')
              return {foundCharacter: false}
            }
          })
      },
      hasBunker: function (AuthService, BunkerStateFactory) {
        console.log('FIRING HASBUNKER IN NAVBAR')
        return AuthService.getLoggedInUser()
          .then(user => {
            if (user) {
              return BunkerStateFactory.getBunkerState(user.id)
            } else {
              console.log('NO BUNKER IN NAVBAR RESOLVE')
              return {noBunker: true}
            }
          })
      }
    }

  })
})
