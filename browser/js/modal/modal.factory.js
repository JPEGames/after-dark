app.factory('ModalFactory', function ($http, $scope, $rootScope) {
  return {
    changeModal: function (newMode, newData) {
      $rootScope.$broadcast(newMode, newData)
    }
  }
})
