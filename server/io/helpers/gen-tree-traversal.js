// <------ USED FOR CREATING EVENT TREE ---->
function endEvent () {
  return Promise.resolve('done')
}

module.exports = function * travelTree (eventConstructor, userId) {
  if (!eventConstructor) {
    console.log('ENDING GENERATOR!')
    return endEvent() // maybe ending function here that resets eventTree to nothing
  }
  console.log('CALLING GENERATOR')
  let nextFunc = yield Promise.resolve(eventConstructor(userId))
  // yield pertinent event info for socket emission
  // this is sent to Angular after user makes a decision
  yield * travelTree(nextFunc, userId)
}
