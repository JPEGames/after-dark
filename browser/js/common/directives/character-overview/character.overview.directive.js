app.directive('characterOverview', function (AuthService, $state, $rootScope, CharOverFactory, ModalFactory, $interval) {
  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/character-overview/char-dir-overview.html',
    link: function (scope) {
      scope.myUsername
      // Needs to be removed later - ELIOT
      AuthService.getLoggedInUser()
        .then(function (user) {
          scope.myUsername = user.username
          $rootScope.socket.emit('loading', user)
        })

      scope.myStats = CharOverFactory.getStats()
      console.log('myStats', scope.myStats)

      scope.myResources = CharOverFactory.getResources()

      scope.myMoney = CharOverFactory.getMoney()

      scope.goToWasteland = function () {
        ModalFactory.leaveBunker()
        ModalFactory.changeModal('message', {
          newContent: {
            title: `Go To Wasteland?`,
            description: `Are you ready to explore the wastes?`,
            eventType: 'yes/no',
            source: '/pimages/vault.png',
            type: 'general',
            id: '12',
            status: 'neutral',
            exitType: 'load',
            next: 'the Wasteland'
          }
        })
        $interval(ModalFactory.openModal, 10, 1)
      }
    }
  }
})
