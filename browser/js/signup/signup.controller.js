app.controller('SignupCtrl', function ($scope, AuthService, $state, SignupFactory) {
  $scope.createUser = function (signupInfo) {
    $scope.error = null

    SignupFactory.createUser(signupInfo).then(function () {
      AuthService.login(signupInfo).then(function () {
        $state.go('master.navbar.signup-settings')
      }).catch(function () {
        $scope.error = 'Invalid login credentials.'
      })
    }).catch(function () {
      $scope.error = 'Could not create account.'
    })
  }
})
