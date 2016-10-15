const treeTraveller = require('../../helpers/gen-tree-traversal')
const resourceTemplates = require('./templates')
let sendEvent = require('../../helpers/send-event')
function removeListener (socket, listener) {
  console.log('remove listener getting called!')
  socket.removeListener(listener, function () {
    console.log('~~~~~~removed listener!~~~~~~~~')
  })
}

module.exports = function (socket) {
  return function (data) {
    let lastEvent
    console.log('received save to backpack payload: ', data)
    // initialize generator
    let iterator = treeTraveller(resourceTemplates.depositResources, socket.userId)
    let result = iterator.next()
    console.log('BACKPACK SAVE RES: ', result)
    // send initial modal event to phaser
    sendEvent(result.value, socket)
      .then(val => {
        lastEvent = val
        console.log('LAST EVENT: ', lastEvent)
      })
    //
    socket.on('backpack_response', function (resData) {
      if (!iterator.done) {
        console.log('RES DATA in BUNKER RESOURCE: ', resData)
        console.log('LAST RESuLT: ', lastEvent)
        console.log('LAST RESULT OPTIONS: ', lastEvent.options)
        let nextConstructor = lastEvent.options[ resData.choice ].create
        result = iterator.next(nextConstructor)
        result.done ? console.log('Sequence is done!')
          : sendEvent(result.value, socket).then((val) => { lastEvent = val })
      }
    })
  }
}
