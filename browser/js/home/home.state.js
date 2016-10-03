app.config(function ($stateProvider) {
  $stateProvider.state('master.navbar.home', {
    url: '/',
    templateUrl: 'js/home/home.html',
    controller: 'HomeController',
    resolve: {
      promptBunkerCreate: function (BunkerStateFactory, AuthService) {
        return AuthService.getLoggedInUser()
          .then(user => {
            if (!user) return false
            return BunkerStateFactory.getBunkerState(user.id)
          })
          .then(bunker => {
            console.log(bunker)
            return bunker.noBunker || false
          })
      }
    }
  })
})
