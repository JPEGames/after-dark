const backPackeEvent = require('./sendBackpackEvent')
const fight = require('./fight')

module.exports = function (socket) {
  socket.on('sendBackpackEvent', backPackeEvent(socket))
  socket.on('fight', fight(socket))
}
