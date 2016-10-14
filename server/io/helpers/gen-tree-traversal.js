// <------ USED FOR CREATING EVENT TREE ---->
function endEvent () {
  return Promise.resolve('done')
}

module.exports = function * travelTree (eventConstructor) {
  if (!eventConstructor) {
    return endEvent() // maybe ending function here that resets eventTree to nothing
  }
  let nextFunc = yield eventConstructor()
  // yield pertinent event info for socket emission
  // this is sent to Angular after user makes a decision
  yield * travelTree(nextFunc)
}
