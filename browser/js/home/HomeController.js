app.controller('HomeController', function ($scope, $state, promptBunkerCreate, BunkerStateFactory, AuthService) {
  angular.extend($scope, {promptBunkerCreate})
  angular.extend($scope, {
    createBunker: () => {
      AuthService.getLoggedInUser()
        .then(user => BunkerStateFactory.createBunker(user.id))
        .then(() => $state.go('master.navbar.game'))
    },
    logout: () => {
      AuthService.logout()
    }
  })
})
