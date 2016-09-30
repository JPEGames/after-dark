app.config(function ($stateProvider) {
  $stateProvider.state('master.navbar.signup', {
    url: '/signup',
    templateUrl: 'js/signup/signup.html',
    controller: 'SignupCtrl'
  })
})
