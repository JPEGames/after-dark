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
      CharOverFactory.getStats()
        .then(character => {
          let { endurance, intelligence, luck, perception, strength, tinkering } = character
          let myStats = { strength, endurance, intelligence, luck, tinkering, perception }
          scope.myStats = statConverter(myStats)
        })
      // Helper to convert retrieved character stats to proper format for display
      function statConverter (statObj) {
        let statArr = []
        Object.keys(statObj).forEach(stat => {
          statArr.push({
            title: `${stat.substring(0, 1).toUpperCase()}${stat.substring(1)}`,
            level: statObj[ stat ],
            myProgress: { 'width': `${statObj[ stat ]}%` }
          })
        })
        return statArr
      }
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
