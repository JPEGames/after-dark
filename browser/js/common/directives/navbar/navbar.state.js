app.config(function ($stateProvider) {
  $stateProvider.state('master.navbar', {
    templateUrl: 'js/common/directives/navbar/navbar-state.html',
    controller: function ($state, $scope, AuthService) {
      $state.go('master.navbar.home')
    }
  })
})
