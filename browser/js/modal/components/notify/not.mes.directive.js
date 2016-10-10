app.directive('notifyMessage', function ($state, ModalFactory) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/notify/not-mes.html',
    scope: {
      data: '='
    },
    link: function (scope) {
      scope.goToMessage = function (messageData) {
        ModalFactory.changeModal('message', messageData)
      }
    }
  }
})
