'use strict'
var socketio = require('socket.io')
var io = null
var currentUsers = []
let userTotal = 0
const backpackEvents = require('./backpack')
const Backpack = require('../db/models/backpack')
module.exports = function (server) {
  if (io) return io

  io = socketio(server)

  io.on('connection', function (socket) {
    console.log('Socket connected.')

    // function for use inside of route
    io.communicate = function (user, message, payload) {
      console.log('payload', payload)
      let recipient = io.findUser(user.id)
      if (!recipient) {
        console.log('Communicate cannot operate before you set the user.')
        return false
      }
      io.sockets.connected[recipient.connection].emit(message, payload)
      console.log('Found recipient ' + recipient.username + ' Sent Message ' + message)
    }
    // for finding correct user to send message + payload
    io.findUser = function (userId) {
      for (let i = 0; i < currentUsers.length; i++) {
        if (currentUsers[i].userId === userId) {
          console.log('User found with ID: ', userId)
          return currentUsers[i]
        }
      }

      console.log('No user found for id received: ', userId)
      return false
    }
    // io.receive = function (message, eventTable) {
    //   socket.on(message, function (data) {
    //     console.log('received emit from client backpack!')
    //   })
    // }
    // upon login through nav-bar client-side
    socket.on('loading', function (data) {
      let duplicate = false
      var userInformation = { username: data.username, userId: data.id, connection: socket.id, eventHistory: [] }
      for (let i = 0; i < currentUsers.length; i++) {
        if (currentUsers[i].userId === data.id) {
          console.log('Detected duplicate!')
          duplicate = true
          break
        }
        if (currentUsers[i].connection === socket.id) {
          currentUsers[i].userId = data.id
          currentUsers[i].username = data.username
          duplicate = true
          break
        }
      }
      if (!duplicate) {
        console.log('Stored user data.')
        currentUsers.push(userInformation)
        duplicate = false
      }
      console.log('Current Users: ', currentUsers)
    })
    // on client refreshes
    socket.on('disconnect', function () {
      let removeId = socket.id
      let removedUser = false
      for (let i = 0; i < currentUsers.length; i++) {
        if (currentUsers[i].connection === removeId) {
          console.log('Removed user from storage.')
          removedUser = true
          currentUsers.splice(i, 1)
          break
        }
      }
      if (!removedUser) {
        console.log('Unable to remove user.')
      }
    })

    /* <------CLIENT EVENT HANDLING--------> */
    socket.on('sendBackpackEvent', function (data) {
      console.log('received Backpack Event!')
      console.log('backpack data: ', data)
      // io.communicate({id: data.id}, 'emitBackpackEvent', {})
      let {userId, resourceInfo} = data
      console.log('USER ID: ', userId)
      console.log('RESOURCE INFO: ', resourceInfo)
      processResource(resourceInfo.type, io.communicate, userId, resourceInfo.id)
    })
  })
  return io
}

function processResource (type, ioMethod, userId, markerId) {
  let resourceEvent = backpackEvents[type]
  resourceEvent.quantity = Math.floor(Math.random() * 20)
  let emittedEvent = `send_${type}`
  Backpack.find({where: {
    userId: userId
  }})
    .then(backpack => {
      console.log('UPDATING BACKPACK: ', backpack)
      console.log('TYPE: ', typeof type, 'QUANTITY: ', resourceEvent.quantity)
      backpack[type] = backpack[type] + resourceEvent.quantity
      return backpack.save()
    })
    .then(updatedBackpack => {
      ioMethod({id: userId}, 'updateBackpack', {})
    })
  ioMethod({id: userId}, emittedEvent, {event: resourceEvent, markerId: markerId, markerType: type})
}
