// <---- CALLBACKS FOR SOCKET LISTENERS ---->
const backpackEvent = require('./backpack-event/sendBackpackEvent')
const fight = require('./fight')
const saveResource = require('./bunker-resources')
const upgradeEvent = require('./upgrades')

// <----- SOCKET LISTENERS FOR MODAL EVENTS ------>
module.exports = function (socket) {
  socket.on('sendBackpackEvent', backpackEvent(socket))
  socket.on('fight', fight(socket))
  socket.on('saveResources_Client', saveResource(socket))
  socket.on('purchaseUpgrades', upgradeEvent(socket))
}
