const fightTemplates = require('./templates')
// const EventTree = require('../../helpers/event-tree')
const treeTraveller = require('../../helpers/gen-tree-traversal')

module.exports = function (socket) {
  return function (data) {
    console.log('received fight payload: ', data)
    if (data.type === 'rat attack') {
      // let ratEvent = fightTemplates.ratAttack.title
      // Initialize event tree
      const sendEvent = function (eventPromise) {
        eventPromise.then(eventObj => {
          socket.emit('serverRes', eventObj)
          return eventObj
        })
      }

      let iterator = treeTraveller(fightTemplates.ratAttack)
      let result = iterator.next()
      let lastEvent = sendEvent(result.value)
      socket.on('response', function (resData) {
        if (!iterator.done) {
          let nextConstructor = lastEvent.options[resData.choice].create
          result = iterator.next(nextConstructor)
          lastEvent = sendEvent(result.value)
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
