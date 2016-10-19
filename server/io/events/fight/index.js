const fightTemplates = require('./templates')
// const EventTree = require('../../helpers/event-tree')
const treeTraveller = require('../../helpers/gen-tree-traversal')
let sendEvent = require('../../helpers/send-event')
var lastEvent
module.exports = function (socket) {
  return function (data) {
    // let lastEvent
    console.log('received fight payload: ', data)
    if (data.type === 'rat attack') {
      console.log('we got a rat attack event from client')

      // Initialize event chain - generator function closes around user ID
      let iterator = treeTraveller(fightTemplates.ratAttack, socket.userId)
      let result = iterator.next()

      // resolve next event in chain (result of a returned create() in
      // options property on event object)
      sendEvent(result.value, socket)
        .then(val => {
          lastEvent = val
          console.log('LAST EVENT: ', lastEvent)
        })
      // SOCKET ERROR HANDLING
      socket.on('error', function (err) {
        console.log('SOCKET ERROR ON FIGHT: ', err)
      })
      socket.on('fight_response', function (resData) {
        console.log('GOT CLIENT FIGHT RESPONSE EMIT: ', resData.choice)
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
}
