const backpackEvents = require('../helpers/backpack.js')
const Backpack = require('../../db').model('backpack')

function processResource (type, socket, userId, markerId) {
  let resourceEvent = backpackEvents[type]
  resourceEvent.quantity = Math.floor(Math.random() * 20)
  let emittedEvent = `send_${type}`
  Backpack.find({where: {userId}})
    .then(backpack => {
      backpack[type] = backpack[type] + resourceEvent.quantity
      return backpack.save()
    })
    .then(updatedBackpack => {
      socket.emit('updateBackpack', {})
    })
  socket.emit(emittedEvent, {event: resourceEvent, markerId: markerId, markerType: type})
}

module.exports = function (socket) {
  return function (data) {
    let {userId, resourceInfo} = data
    processResource(resourceInfo.type, socket, userId, resourceInfo.id)
  }
}
