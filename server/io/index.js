'use strict'
var socketio = require('socket.io')
var io = null
var currentUsers = []
module.exports = function (server) {
  if (io) return io

  io = socketio(server)

  io.on('connection', function (socket) {
    console.log('Socket connected.')
    io.communicate = function (message, payload) {
      io.emit(message, payload)
    }
    socket.on('loading', function (data) {
      currentUsers.push({ user: data, connection: socket.id })
      console.log({ user: data, connection: socket.id })
    })
  })
  return io
}



