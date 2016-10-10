app.controller('LoginCtrl', function ($scope, AuthService, $state, CharacterFactory, NavbarFactory) {
  $scope.login = {}
  $scope.error = null

  $scope.sendLogin = function (loginInfo) {
    $scope.error = null

    AuthService.login(loginInfo).then(function () {
      if (NavbarFactory.getter().hasCharacter) $state.go('master.navbar.characterOverview')
      else $state.go('master.navbar.characterCreate')
    }).catch(function (error) {
      console.log(error)
      $scope.error = 'Invalid login credentials OR no character'
    })
  }
})
