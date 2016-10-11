app.directive('notify', function ($state, ModalFactory) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/notify/notify.html',
    // controller: 'NotifyController',
    scope: {
      notifications: '='
    },
    link: function (scope) {
      scope.exitNotify = function (data) {
        if (data) {
          ModalFactory.resetModal()
        } else {
          ModalFactory.resetModal(data)
        }
      }
    }
  }
})
