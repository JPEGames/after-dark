app.config(function ($stateProvider) {
  $stateProvider.state('master.navbar.characterCreate', {
    url: '/characterCreate',
    templateUrl: 'js/character-creation/character-create.html',
    controller: 'CharCreateController',
    resolve: {
      signupCheck: function () {

      }
    }
  })
})
