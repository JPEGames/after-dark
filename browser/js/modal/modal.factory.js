app.factory('ModalFactory', function ($http, $rootScope) {
  return {
    // Change the modal to any mode. Can accept data.
    changeModal: function (newMode, newData) {
      console.log('Called Factory Function!')
      newData.newMode = newMode
      $rootScope.$broadcast('modeChange', newData)
    },
    // Reset modal to its default state.
    resetModal: function () {
      $rootScope.$broadcast('modeReset')
    },
    // Mark a message as read.
    markRead: function (aMessage) {
      if (aMessage.response) {
        console.log('User response to prompt was: ', aMessage.response)
      }
      $rootScope.$broadcast('messageRead', aMessage)
    },
    // Open modal from anywhere.
    openModal: function () {
      $('#myModal').modal('show')
    },
    // Close modal from anywhere.
    closeModal: function () {
      $('#myModal').modal('hide')
    },
    submitResponse: function (aResponse) {
      // This is where we would be sending some information to a server.
      console.log('Submitted Response Below')
      console.log(aResponse)
    }
  }
})
