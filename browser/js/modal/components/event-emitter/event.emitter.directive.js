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
        ModalFactory.markRead(aMessage)
        ModalFactory.changeModal('notify', {})
      }

      scope.denyMessage = function (aMessage) {
        console.log('Denied!')
        ModalFactory.markRead(aMessage)
        ModalFactory.changeModal('notify', {})
      }
    }
  }
})
