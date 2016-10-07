app.config(function ($stateProvider) {
  $stateProvider.state('master.navbar.characterOverview', {
    url: '/characterOverview',
    templateUrl: 'js/character-overview/char-overview.html',
    controller: 'CharOverviewController',
    resolve: {
      myCharacter: function (CharacterFactory) {
        console.log('Got character!')
        return CharacterFactory.getCharacter()
      }
    }
  })
})
