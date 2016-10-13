module.exports = function * travelTree (eventTree) {
  if (!eventTree) {
    return // maybe ending function here that resets eventTree to nothing
  }
  var currentTree = eventTree
  let choice = yield currentTree.event

  if (currentTree.outcomes.length > 0) {
    yield *travelTree(currentTree.outcomes[choice])
  }
}