module.exports = function * travelTree (eventTree) {
  if (!eventTree) {
    return // maybe ending function here that resets eventTree to nothing
  }
  var currentTree = eventTree
  let {title, description, eventType,
    source, id, status, exitType, next} = currentTree
  let eventInfo = {title, description, eventType, source, id, status, exitType, next}
  console.log('Event info: ', eventInfo)
  let choice = yield eventInfo

  if (currentTree.outcomes.length > 0) {
    yield * travelTree(currentTree.outcomes[choice])
  }
}
