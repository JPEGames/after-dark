app.directive('eventEmitter', function ($state, ModalFactory) {
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
        ModalFactory.markRead(aMessage)
        ModalFactory.changeModal('notify', {})
      }

      scope.confirmMessage = function (aMessage) {
        console.log('Confirmed!')
        aMessage.response = true
        ModalFactory.markRead(aMessage)
        ModalFactory.changeModal('notify', {})
      }

      scope.denyMessage = function (aMessage) {
        console.log('Denied!')
        aMessage.response = false
        ModalFactory.markRead(aMessage)
        ModalFactory.changeModal('notify', {})
      }

      scope.submitAnswer = function (aMessage, aResponse) {
        console.log('Recieved response to variadic.')
        aMessage.response = aResponse
        console.log('Response is: ', aMessage.response)
        ModalFactory.submitResponse(aResponse)
        ModalFactory.markRead(aMessage)
        ModalFactory.changeModal('notify', {})
      }
    }
  }
})
