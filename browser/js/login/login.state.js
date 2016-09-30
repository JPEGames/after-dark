app.config(function ($stateProvider) {
  $stateProvider.state('master.navbar.login', {
    url: '/login',
    templateUrl: 'js/login/login.html',
    controller: 'LoginCtrl'
  })
})
