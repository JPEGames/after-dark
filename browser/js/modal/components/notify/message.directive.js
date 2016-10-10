app.directive('message', function ($state) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/components/notify/message.html',
    scope: {
      content: '='
    }
  }
})
