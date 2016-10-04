app.controller('HomeController', function ($scope, $state, promptBunkerCreate, BunkerStateFactory, AuthService) {
  // assigns resolved promptBunkerCreate boolean to $scope
  angular.extend($scope, {promptBunkerCreate})

  // createBunker $scope method creates bunker associated with
  angular.extend($scope, {
    createBunker: () => {
      AuthService.getLoggedInUser()
        .then(user => BunkerStateFactory.createBunker(user.id))
        .then(() => $state.go('master.navbar.characterCreate'))
    },
    logout: () => {
      AuthService.logout()
    }
  })
})
