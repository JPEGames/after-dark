app.directive('upgradeRow', function ($state, ModalFactory) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/upgrades/upgrade-row.html',
    scope: {
      data: '='
    },
    link: function (scope) {
      scope.submitAnswer = function (aMessage, aResponse) {
        console.log('Recieved response to variadic.')
        aMessage.response = aResponse
        console.log('MESSAGE: ', aMessage)
        console.log('Response is: ', aMessage.response)
        ModalFactory.submitResponse(aResponse, aMessage.socketMsg, aMessage.category, aMessage.afterEffect)
        ModalFactory.markRead(aMessage)
        ModalFactory.nextModal(aMessage)
      }
    }
  }
})
