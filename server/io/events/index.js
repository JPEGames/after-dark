const backpackEvent = require('./sendBackpackEvent')
const fight = require('./fight')

module.exports = function (socket) {
  socket.on('sendBackpackEvent', backpackEvent(socket))
  socket.on('fight', fight(socket))
}
