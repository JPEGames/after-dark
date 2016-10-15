const fightTemplates = require('./templates')
// const EventTree = require('../../helpers/event-tree')
const treeTraveller = require('../../helpers/gen-tree-traversal')
let sendEvent = require('../../helpers/send-event')

module.exports = function (socket) {
  return function (data) {
    let lastEvent
    console.log('received fight payload: ', data)
    if (data.type === 'rat attack') {
      console.log('we got a rat attack event from server')
      // Helper function used to emit correct event objects to client socket
      // const sendEvent = function (eventPromise, socket) {
      //   console.log('Calling sendEvent!')
      //   return eventPromise.then(eventObj => {
      //     console.log('PROMISE RESOLVING: about to emit serverRes')
      //     socket.emit('serverRes', eventObj)
      //     return eventObj
      //   })
      // }
      // Initialize event chain - generator function closes around user ID
      let iterator = treeTraveller(fightTemplates.ratAttack, socket.userId)
      let result = iterator.next()
      console.log('INITIAL RESULT:', result)
      // resolve next event in chain (result of a returned create() in
      // options property on event object)
      sendEvent(result.value, socket)
        .then(val => {
          lastEvent = val
          console.log('LAST EVENT: ', lastEvent)
        })
      socket.on('fight_response', function (resData) {
        if (!iterator.done) {
          console.log('RES DATA: ', resData)
          let nextConstructor = lastEvent.options[ resData.choice ].create
          result = iterator.next(nextConstructor)
          result.done ? console.log('Sequence is done!')
            : sendEvent(result.value, socket).then((val) => {
              lastEvent = val
            })
        }
      })

      // TODO: this part needs to be in a function!
      // user chose to fight...

      // let treeRoot = treeCreator(fightTemplates.ratAttack)
      // populate possible outcomes for root event
      // fightTemplates.run(data.dangerLvl, data.userId)
      //   .then(runResult => {
      //     console.log('run result: ', runResult)
      //     let {title, description, eventType, source, id, status, exitType, next, options} = runResult
      //     // insert generated outcome of run choice
      //     if (!treeRoot.contains(title)) {
      //       treeRoot.insert(ratEvent, title, description, eventType,
      //         source, id, status, exitType, next, options)
      //     }
      //     return fightTemplates.fight(data.dangerLvl, data.userId)
      //   })
      //   .then(fightResult => {
      //     console.log('fight result: ', fightResult)
      //     let {title, description, eventType, source, id, status, exitType, next, options} = fightResult
      //     // insert generated outcome of fight choice
      //     if (!treeRoot.contains(title)) {
      //       treeRoot.insert(ratEvent, title, description, eventType,
      //         source, id, status, exitType, next, options)
      //     }
      //     // initialize generator function
      //     var iterator = treeTraveller(treeRoot)
      //     var result = iterator.next()
      //     // send rat attack info to front

      //   })
    }
  }
}
