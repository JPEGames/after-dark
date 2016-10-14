let fightTemplates = require('./templates')
let EventTree = require('../../helpers/event-tree')
module.exports = function (socket) {
  return function (data) {
    console.log('received fight payload: ', data)
    if (data.type === 'rat attack') {
      let treeRoot = treeCreator(fightTemplates.ratAttack)
      fightTemplates.run(data.dangerLvl, data.userId)
        .then(runResult => {
          console.log('run RESULT: ', runResult)
          treeRoot.insert(fightTemplates.ratAttack.title, runResult)
        })

    }
  }
}

function treeCreator (initialEventObj) {
  let {title, description, src, id, status, exitType, next} = initialEventObj
  return new EventTree(title, description, src, id, status, exitType, next)
}
