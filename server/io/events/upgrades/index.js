const upgradeTemplates = require('./templates')
// const EventTree = require('../../helpers/event-tree')
const treeTraveller = require('../../helpers/gen-tree-traversal')
const sendEvent = require('../../helpers/send-event')

module.exports = function (socket) {
  return function (data) {
    let lastEvent
    // initialize generator
    let iterator = treeTraveller(upgradeTemplates.initialChoice, socket.userId)
    let result = iterator.next()
    // send initial modal event to phaser
    sendEvent(result.value, socket)
      .then(val => {
        lastEvent = val
      })
    //
    socket.on('upgrade_response', function (resData) {
      if (!iterator.done) {
        let nextConstructor = lastEvent.options[ resData.choice ].create
        result = iterator.next(nextConstructor)
        result.done ? console.log('Sequence is done!')
          : sendEvent(result.value, socket).then((val) => {
            lastEvent = val
          })
      }
    })
  }
}
