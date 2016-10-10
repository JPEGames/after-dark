app.config(function ($stateProvider) {
  $stateProvider.state('master.navbar.home', {
    url: '/',
    templateUrl: 'js/home/home.html',
    controller: 'HomeController',
    resolve: {
      hasBunker: function (NavbarFactory) {
        return NavbarFactory.getter().hasBunker
      },
      hasUser: function (AuthService) {
        return AuthService.getLoggedInUser()
          .then(user => {
            if (user) return true
            else return false
          })
      }
      // promptBunkerCreate: function (BunkerStateFactory, AuthService) {
      //   return AuthService.getLoggedInUser()
      //     .then(user => {
      //       if (!user) return false
      //       return BunkerStateFactory.getBunkerState(user.id)
      //     })
      //     .then(bunker => {
      //       console.log(bunker)
      //       return bunker.noBunker || false
      //     })
      // }
    }
  })
})
