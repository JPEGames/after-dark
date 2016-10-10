app.directive('modal', function ($state) {
  return {
    restrict: 'E',
    templateUrl: 'js/modal/modal.html',
    controller: 'ModalController'
  }
})
