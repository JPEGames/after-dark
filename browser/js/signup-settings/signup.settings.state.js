app.config(function ($stateProvider) {
  $stateProvider.state('master.navbar.signup-settings', {
    url: '/signup-settings',
    templateUrl: 'js/signup-settings/signup-settings.html',
    controller: 'SignupSettingsCtrl'
  })
})
