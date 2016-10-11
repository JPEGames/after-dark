app.factory('ModalFactory', function ($http, $rootScope) {
  return {
    changeModal: function (newMode, newData) {
      console.log('Called Factory Function!')
      newData.newMode = newMode
      $rootScope.$broadcast('modeChange', newData)
    },
    resetModal: function () {
      $rootScope.$broadcast('modeReset')
    },
    markRead: function (aMessage) {
      $rootScope.$broadcast('messageRead', aMessage)
    }
  }
})
