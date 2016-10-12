app.directive('eventEmitter', function ($state, ModalFactory) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/event-emitter/event-emitter.html',
    // controller: 'EEController'
    scope: {
      content: '='
    },
    link: function (scope) {
      function nextModal (aMessage) {
        if (aMessage.exitType === 'load') {
          ModalFactory.startLoading({title: aMessage.next})
        } else {
          if (ModalFactory.lastMessage()) {
            ModalFactory.resetModal()
            ModalFactory.closeModal()
          } else {
            if (aMessage.exitType) {
              if (aMessage.exitType === 'immediate') {
                ModalFactory.resetModal()
                ModalFactory.closeModal()
              } else {
                ModalFactory.changeModal('notify', {})
              }
            } else {
              ModalFactory.changeModal('notify', {})
            }
          }
        }
      }
      // Should also mark as read and remove from list.
      scope.exitMessage = function (aMessage) {
        ModalFactory.markRead(aMessage)
        nextModal(aMessage)
      }

      scope.confirmMessage = function (aMessage) {
        console.log('Confirmed!')
        aMessage.response = true
        ModalFactory.markRead(aMessage)
        nextModal(aMessage)
      }

      scope.denyMessage = function (aMessage) {
        console.log('Denied!')
        aMessage.response = false
        ModalFactory.markRead(aMessage)
        nextModal(aMessage)
      }

      scope.submitAnswer = function (aMessage, aResponse) {
        console.log('Recieved response to variadic.')
        aMessage.response = aResponse
        console.log('Response is: ', aMessage.response)
        ModalFactory.submitResponse(aResponse)
        ModalFactory.markRead(aMessage)
        nextModal(aMessage)
      }
    }
  }
})
