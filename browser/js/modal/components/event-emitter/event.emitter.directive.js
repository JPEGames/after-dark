app.directive('eventEmitter', function ($state, ModalFactory, $interval) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/event-emitter/event-emitter.html',
    // controller: 'EEController'
    scope: {
      content: '='
    },
    link: function (scope) {
      // Should also mark as read and remove from list.
      scope.exitMessage = function (aMessage) {
        ModalFactory.submitResponse(0, aMessage.socketMsg, aMessage.category, aMessage.afterEffect)
        ModalFactory.markRead(aMessage)
        ModalFactory.nextModal(aMessage)
      }

      scope.confirmMessage = function (aMessage) {
        console.log('Confirmed!')
        console.log('A MESSAGE: ', aMessage)
        aMessage.response = true
        ModalFactory.submitResponse(1, aMessage.socketMsg, aMessage.category, aMessage.afterEffect)
        ModalFactory.markRead(aMessage)
        ModalFactory.nextModal(aMessage)
      }

      scope.denyMessage = function (aMessage) {
        console.log('Denied!')
        aMessage.response = false
        ModalFactory.submitResponse(0, aMessage.socketMsg, aMessage.category, aMessage.afterEffect)
        ModalFactory.markRead(aMessage)
        ModalFactory.nextModal(aMessage)
      }

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
