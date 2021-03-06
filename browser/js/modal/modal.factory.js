app.factory('ModalFactory', function ($state, $http, $rootScope) {
  // NEW DUMMY OBJECTS - BACKEND PPL CHECK IT OUT
  let testMessages = []
  let testUpgrades = [
    {
      // HEADER
      title: 'Upgrade 1',
      description: 'This upgrade increases something, somewhere.',
      source: '/pimages/electricity.png',
      // ARBITRARY
      id: 999,
      // COLOR
      status: 'neutral',
      // literally exit type
      exitType: 'load',
      costs: [
        { type: 'metal', quantity: 50 },
        { type: 'electricity', quantity: 20 },
        { type: 'water', quantity: 15 },
        { type: 'oxygen', quantity: 5 }
      ],
      benefits: [
        { type: 'capacity', category: 'oxygen', benefit: 'plus', quantity: '10' },
        { type: 'capacity', category: 'water', benefit: 'plus', quantity: '10' },
        { type: 'capacity', category: 'metal', benefit: 'plus', quantity: '10' },
        { type: 'capacity', category: 'electricity', benefit: 'plus', quantity: '10' }
      ],
      // custom load message
      next: ''
    }
  ]
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
   source: '/pimages/metal.png',
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

  // Right here begins my hacks - not ideal - but other solutions is eventing
  // which is complex.
  let modalOpen = false
  let nextDeletion = {}
  // Vars setting yes/no state of modal in terms of leave or exit.
  let goToBunker = false
  let leaveTheBunker = false

  return {
    // Marker functions for presentation, need deleted - ELIOT
    wipeMarker: function () {
      console.log('Wiping a marker, id: ' + nextDeletion.id)
      $rootScope.$emit('DeleteMarker', nextDeletion)
      nextDeletion = {}
    },
    setMarker: function (aMarker) {
      console.log('Setting next marker to delete to id: ' + aMarker.id)
      nextDeletion = aMarker
    },
    // Change the modal to any mode. Can accept data.
    changeModal: function (newMode, newData) {
      console.log('Called Factory Function!')
      console.log('Switching to new mode: ', newMode)
      if (newData) {
        newData.newMode = newMode
        $rootScope.$broadcast('modeChange', newData)
      } else {
        let newData = {}
        newData.newMode = newMode
        $rootScope.$broadcast('modeChange', newData)
      }
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
      if ((goToBunker || leaveTheBunker) && aMessage.response) {
        if (goToBunker) {
          goToBunker = false
          $state.go('master.navbar.game')
        }
        if (leaveTheBunker) {
          leaveTheBunker = false
          $state.go('master.navbar.gamear')
        }
      } else {
        if (goToBunker || leaveTheBunker) {
          goToBunker = false
          leaveTheBunker = false
          this.closeModal()
        }
      }
      this.wipeMarker()
    },
    // Open modal from anywhere.
    openModal: function () {
      $('#myModal').modal('show')
      modalOpen = true
      $rootScope.$broadcast('pause')
    },
    // Close modal from anywhere.
    closeModal: function () {
      $('#myModal').modal('hide')
      modalOpen = false
      $rootScope.$broadcast('resume')
    },
    getModalOpen: function () {
      return modalOpen
    },
    submitResponse: function (aResponse, socketBool, category, afterEffect) {
      // This is where we would be sending some information to a server.
      console.log('Submitted Response Below')
      console.log(aResponse)
      console.log('Response category: ', category)
      // Only emit 'response' when event objects in an event chain
      // are sent up from the server!
      if (socketBool) {
        if (category === 'fight') {
          console.log('Firing socket response~~~~~~~')
          $rootScope.socket.emit('fight_response', { choice: aResponse })
        }
        if (category === 'saveBackpack') {
          console.warn('Firing socket response for saving backpack~~~')
          $rootScope.socket.emit('backpack_response', { choice: aResponse })
          if (afterEffect) {
            $rootScope.$broadcast(afterEffect)
          }
        }
        if (category === 'upgrade') {
          console.warn('Firing socket response for purchasing upgrades!')
          $rootScope.socket.emit('upgrade_response', { choice: aResponse })
          if (afterEffect) {
            $rootScope.$broadcast(afterEffect)
          }
        }
      }
    },
    getMessages: function () {
      return testMessages
    },
    deleteMessage: function (aMessage) {
      let removedMessages = 0
      let indexesToRemove = []
      testMessages.forEach(function (mes, index) {
        if (mes.id === aMessage.id) {
          console.log(mes.id + ' vs. ' + aMessage.id)
          console.log('Matched up message to delete', mes)
          indexesToRemove.push(mes.id)
        }
      })
      console.log('Pre filter messages: ')
      console.log(testMessages)
      testMessages = testMessages.filter(function (elem) {
        let tempBool = true
        for (let i = 0; i < indexesToRemove.length; i++) {
          if (indexesToRemove[ i ] === elem.id) {
            console.log('Match @ index ' + i + ' between ' + indexesToRemove[ i ] + ' and ' + elem.id)
            removedMessages++
            tempBool = false
            break
          }
        }
        return tempBool
      })
      console.log('Post filter messages:')
      console.log(testMessages)
      console.log('Removed ' + removedMessages + ' messages.')
      if (testMessages.length === 0) {
        console.error('CLOSING MODAL! NO MORE TEST MESSAGES!')
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
      console.log('Broadcasting startLoad!!')
      $rootScope.$broadcast('startLoad', loadData)
    },
    addMessage: function (message) {
      console.log('Adding message: ', message)
      let tempMessages = testMessages.slice()
      tempMessages.push(message)
      console.log('Dupe Temp Array: ', tempMessages)
      tempMessages = _.uniq(tempMessages)
      // TODO: this temporarily takes care of double addMessage call
      testMessages = tempMessages
      console.log('Final Msg Array: ', testMessages)
    },
    setMessages: function (messageArr) {
      console.log('Setting messages!')
      if (this.lastMessage()) {
        testMessages = messageArr
      } else {
        testMessages.concat(messageArr)
      }
    },
    updateInventory: function (newInventory) {
      $rootScope.$broadcast('updateInventory', newInventory)
    },
    enterBunker: function () {
      goToBunker = true
    },
    leaveBunker: function () {
      leaveTheBunker = true
    },
    getUpgrades: function () {
      return testUpgrades
    },
    nextModal: function (aMessage) {
      if (aMessage.exitType === 'load') {
        this.startLoading({ title: aMessage.next })
      } else {
        if (aMessage.exitType && this.lastMessage()) {
          if (aMessage.exitType === 'immediate') {
            console.warn('EXIT TYPE IS IMMEDIATE AND LAST MESSAGE IN NEXT MODAL')
            this.resetModal()
            this.closeModal()
          } else {
            this.changeModal('notify', {})
          }
        } else {
          this.changeModal('notify', {})
        }
      }
    }
  }
})
