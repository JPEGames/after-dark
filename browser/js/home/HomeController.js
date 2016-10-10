app.controller('HomeController', function ($scope, $state, BunkerStateFactory, AuthService, hasBunker, hasUser) {
  console.log('IN HOME CONTROLLER')
  // assigns resolved promptBunkerCreate boolean to $scope
  // angular.extend($scope, {promptBunkerCreate})

  $scope.user = hasUser
  $scope.hasBunker = hasBunker
  console.log('has bunker in home: ', $scope.hasBunker, 'has user in home: ', $scope.user)

  // createBunker $scope method creates bunker associated with
  angular.extend($scope, {
    createBunker: () => {
      AuthService.getLoggedInUser()
        .then(user => BunkerStateFactory.createBunker(user.id))
        .then(() => $state.go('master.navbar.gamear'))
    },
    logout: () => {
      AuthService.logout()
    }
  })
})
