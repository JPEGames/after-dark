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

      // <---- SET STATS IN CHARACTER OVERVIEW ---->
      CharOverFactory.getCharacter()
        .then(character => {
          let { endurance, intelligence, luck, perception, strength, tinkering } = character
          let myStats = { strength, endurance, intelligence, luck, tinkering, perception }
          scope.myStats = CharOverFactory.statConverter(myStats)
        })

      // <---- SET RESOURCES && MONEY IN CHARACTER OVERVIEW ---->
      CharOverFactory.resourceGenerator()
        .then(resourceArray => {
          scope.myResources = resourceArray
          scope.myMoney = CharOverFactory.getMoney()
          console.log('RESOURCES IN STAT VIEW: ', scope.myResources)
        })

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
