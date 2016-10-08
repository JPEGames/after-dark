app.controller('LoginCtrl', function ($scope, AuthService, $state, CharacterFactory) {
  $scope.login = {}
  $scope.error = null

  $scope.sendLogin = function (loginInfo) {
    $scope.error = null

    AuthService.login(loginInfo).then(function () {
      $state.go('master.navbar.characterOverview')
    }).catch(function (error) {
      console.log(error)
      $scope.error = 'Invalid login credentials OR no character'
    })
  }
})
