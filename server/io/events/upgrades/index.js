const upgradeTemplates = require('./templates')
// const EventTree = require('../../helpers/event-tree')
const treeTraveller = require('../../helpers/gen-tree-traversal')
const sendEvent = require('../../helpers/send-event')
var lastEvent
module.exports = function (socket) {
  return function (data) {
    // initialize generator
    let iterator = treeTraveller(upgradeTemplates, socket.userId)
    let result = iterator.next()
    console.log('Initial yielded value: ', result)
    // send initial modal event to phaser
    sendEvent(result.value, socket)
      .then(val => {
        lastEvent = val
        console.log('Last Event~~~', lastEvent)
      })
    // SOCKET ERROR HANDLING
    socket.on('error', function (err) {
      console.log('SOCKET ERROR: ', err)
    })
    socket.on('upgrade_response', function (resData) {
      if (!iterator.done) {
        console.log('RES DATA CHOICE: ', resData.choice)
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
