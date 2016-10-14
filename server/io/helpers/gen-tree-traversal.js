module.exports = function * travelTree (eventTree) {
  if (!eventTree) {
    return // maybe ending function here that resets eventTree to nothing
  }
  var currentTree = eventTree
  let {title, description, eventType,
    source, id, status, exitType, next, options} = currentTree
  let eventInfo = {title, description, eventType, source, id, status, exitType, next, options}
  // yield pertinent event info for socket emission
  let choice = yield eventInfo

  if (currentTree.outcomes.length > 0) {
    yield * travelTree(currentTree.outcomes[choice])
  }
}
