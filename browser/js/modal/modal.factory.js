app.factory('ModalFactory', function ($http, $rootScope) {
  // NEW DUMMY OBJECTS - BACKEND PPL CHECK IT OUT
  let testMessages = []
  /*
  {
    title: 'An Event',
    description: 'Something somewhere happened to someone.',
    eventType: 'confirm',
    source: '/pimages/message.png',
    type: 'general',
    id: 1,
    status: 'neutral',
    // exitType: 'load', if activated - will cause a load state
    next: 'Any Event'
  },
  {
    title: 'Another Event',
    description: 'Something somewhere happened to someone else!',
    eventType: 'yes/no',
    source: '/pimages/message.png',
    type: 'general',
    id: 2,
    status: 'danger'
  },
  {
    title: 'Metal Found',
    description: 'You gathered some metal.',
    quantity: 17,
    eventType: 'confirm',
    id: 3,
    type: 'resource',
    source: '/pimages/ore.png',
    status: 'success'
  },
  {
    title: 'Earthling Assault!',
    description: 'A group of earthlings has appeared out of the dust with intentions of attacking you! What will you do?',
    eventType: 'variadic',
    options: [
      {title: 'Run', req: false, action: 1},
      {title: 'Fight', req: false, action: 2},
      {title: 'Talk', req: false, action: 3}
    ],
    id: 4,
    type: 'general',
    source: '/pimages/message.png',
    status: 'neutral'
  }
  ]
  */

  let modalOpen = false

  return {
    // Change the modal to any mode. Can accept data.
    changeModal: function (newMode, newData) {
      console.log('Called Factory Function!')
      console.log('Switching to new mode: ', newMode)
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
      modalOpen = true
    },
    // Close modal from anywhere.
    closeModal: function () {
      $('#myModal').modal('hide')
      modalOpen = false
    },
    getModalOpen: function () {
      return modalOpen
    },
    submitResponse: function (aResponse) {
      // This is where we would be sending some information to a server.
      console.log('Submitted Response Below')
      console.log(aResponse)
    },
    getMessages: function () {
      return testMessages
    },
    deleteMessage: function (aMessage) {
      let indexToRemove = null
      testMessages.forEach(function (mes, index) {
        if (mes.id === aMessage.id) {
          indexToRemove = index
        }
      })
      if (indexToRemove !== null) {
        testMessages.splice(indexToRemove, 1)
        console.log('Removed Message!')
      } else {
        console.log('Could not find message to remove.')
        console.log(aMessage)
      }
    },
    lastMessage: function () {
      if (testMessages.length < 1) {
        console.log('Last message in batch. #', testMessages.length)
        return true
      } else {
        console.log('Not last message in batch. #', testMessages.length)
        return false
      }
    },
    startLoading: function (loadData) {
      if (!loadData) {
        loadData = {}
      }
      $rootScope.$broadcast('startLoad', loadData)
    },
    addMessage: function (message) {
      console.log('Adding message: ', message)
      testMessages.push(message)
      // TODO: this temporarily takes care of double addMessage call
      testMessages = _.uniq(testMessages)
      console.log('Test messages: ', testMessages)
    }
  }
})
