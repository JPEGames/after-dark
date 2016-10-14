const fightTemplates = require('./templates')
const EventTree = require('../../helpers/event-tree')
const treeTraveller = require('../../helpers/gen-tree-traversal')
module.exports = function (socket) {
  return function (data) {
    console.log('received fight payload: ', data)
    if (data.type === 'rat attack') {
      let ratEvent = fightTemplates.ratAttack.title
      // Initialize event tree
      let treeRoot = treeCreator(fightTemplates.ratAttack)
      // populate possible outcomes for root event
      fightTemplates.run(data.dangerLvl, data.userId)
        .then(runResult => {
          console.log('run result: ', runResult)
          let {title, description, eventType,
            source, id, status, exitType, next, options} = runResult
          // insert generated outcome of run choice
          if (!treeRoot.contains(runResult.title)) {
            treeRoot.insert(ratEvent, title, description, eventType,
              source, id, status, exitType, next, options)
          }
          return fightTemplates.fight(data.dangerLvl, data.userId)
        })
        .then(fightResult => {
          console.log('fight result: ', fightResult)
          let {title, description, eventType,
            source, id, status, exitType, next, options} = fightResult
          // insert generated outcome of fight choice
          if (!treeRoot.contains(fightResult.title)) {
            treeRoot.insert(ratEvent, title, description, eventType,
              source, id, status, exitType, next, options)
          }
          console.log('FINAL TREE: ', treeRoot)
          // initialize generator function
          var iterator = treeTraveller(treeRoot)
          var result = iterator.next()
          console.log('ITERATOR RESULT: ', result)
          socket.emit('send_rat_attack', result.value)
        })
    }
  }
}

function treeCreator (initialEventObj) {
  let {title, description, eventType, source, id, status, exitType, next, options} = initialEventObj
  return new EventTree(title, description, eventType, source, id, status, exitType, next, options)
}
