const backpackEvents = require('../../helpers/backpack.js')
const Backpack = require('../../../db/index').model('backpack')

function processResource (type, socket, userId, markerId) {
  console.log('Processing Resource!')
  let resourceEvent = backpackEvents[type]
  resourceEvent.quantity = Math.floor(Math.random() * 20)
  let emittedEvent = `send_${type}`
  // update backpack in backend upon clicking on resource
  Backpack.find({where: {userId}})
    .then(backpack => {
      backpack[type] = backpack[type] + resourceEvent.quantity
      return backpack.save()
    })
    .then(updatedBackpack => {
      socket.emit('updateBackpack', {}) // update client-side inventory
    })
  // for handling client-side resource modals
  socket.emit(emittedEvent, {event: resourceEvent, markerId: markerId, markerType: type})
}

module.exports = function (socket) {
  return function (data) {
    let {userId, resourceInfo} = data
    processResource(resourceInfo.type, socket, userId, resourceInfo.id)
  }
}
