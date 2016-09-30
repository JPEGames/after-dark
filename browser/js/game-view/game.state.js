app.config(function ($stateProvider) {
  $stateProvider.state('master.navbar.game', {
    url: '/game',
    templateUrl: 'js/game-view/game-view.html',
    controller: 'GameController',
    resolve: {
      showGame: function () {
        return true
      }
    }
  })
})

