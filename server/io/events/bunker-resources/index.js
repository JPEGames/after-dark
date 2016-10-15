const treeTraveller = require('../../helpers/gen-tree-traversal')
const resourceTemplates = require('./templates')
let sendEvent = require('../../helpers/send-event')

module.exports = function (socket) {
  return function (data) {
    let lastEvent
    console.log('received save to backpack payload: ', data)
    // initialize generator
    let iterator = treeTraveller(resourceTemplates.depositResources, socket.userId)
    let result = iterator.next()
    console.log('BACKPACK SAVE RES: ', result)
    // send initial modal event to phaser
    // TODO: responses currently handled in 'fight' socket route!!
    sendEvent(result.value, socket)
      .then(val => {
        lastEvent = val
        console.log('LAST EVENT: ', lastEvent)
      })
  }
}
