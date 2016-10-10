app.factory('ModalFactory', function ($http, $rootScope) {
  return {
    changeModal: function (newMode, newData) {
      console.log('Called Factory Function!')
      $rootScope.$broadcast('modeChange', newData)
    },
    resetModal: function () {
      $rootScope.$broadcast('modeReset')
    }
  }
})
