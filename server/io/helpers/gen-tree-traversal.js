// <------ USED FOR CREATING EVENT TREE ---->
module.exports = function * travelTree (eventTree) {
  if (!eventTree) {
    return // maybe ending function here that resets eventTree to nothing
  }
  var currentTree = eventTree.action()
  let {title, description, eventType,
    source, id, status, exitType, next, options, type} = currentTree
  let eventInfo = {title, description, eventType, source, id, status, exitType, next, options, type}
  // yield pertinent event info for socket emission
  // this is sent to Angular after user makes a decision
  let choice = yield eventInfo

  if (currentTree.outcomes.length > 0) {
    yield * travelTree(currentTree.outcomes[choice])
  }
}
