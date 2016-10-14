// <---- CALLBACKS FOR SOCKET LISTENERS ---->
const backpackEvent = require('./backpack-event/sendBackpackEvent')
const fight = require('./fight')

// <----- SOCKET LISTENERS FOR MODAL EVENTS ------>
module.exports = function (socket) {
  socket.on('sendBackpackEvent', backpackEvent(socket))
  socket.on('fight', fight(socket))
}
