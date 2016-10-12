app.config(function ($stateProvider) {
  $stateProvider.state('master.navbar.gamear', {
    url: '/gamear',
    templateUrl: 'js/ar-view/ar-view.html',
    controller: 'ARController',
    resolve: {
      showAR: function () {
        return true
      },
      currentUser: function (AuthService) {
        return AuthService.getLoggedInUser()
      }
    }
  })
})
