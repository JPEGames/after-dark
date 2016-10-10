app.directive('notify', function ($state) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/notify/notify.html',
    // controller: 'NotifyController'
    scope: {
      notifications: '='
    }
  }
})
