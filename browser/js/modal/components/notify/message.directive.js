app.directive('message', function ($state, ModalFactory) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/notify/message.html',
    scope: {
      content: '='
    },
    link: function (scope) {
      // Should also mark as read and remove from list.
      scope.exitMessage = function () {
        ModalFactory.resetModal()
      }
    }
  }
})
