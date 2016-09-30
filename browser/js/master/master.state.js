app.config(function ($stateProvider) {
  $stateProvider.state('master', {
    templateUrl: 'js/master/master.html',
    controller: function ($scope, $state) {
      $state.go('master.navbar.home')
    }
  })
})
