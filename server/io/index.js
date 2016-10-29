'use strict'
var socketio = require('socket.io')
var io = null
var currentUsers = []
const listeners = require('./events')
module.exports = function (server) {
  if (io) return io

  io = socketio(server)

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

  io.on('connection', function (socket) {
    console.log('Socket connected.')

    // upon login through nav-bar client-side
    socket.on('loading', function (data) {
      let duplicate = false
      socket.userId = data.id
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
        // attach event listeners here!
        listeners(socket)
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
  })
  return io
}
