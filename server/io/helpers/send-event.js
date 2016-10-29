module.exports = function (eventPromise, socket) {
  console.log('Calling sendEvent!')
  return eventPromise.then(eventObj => {
    console.log('PROMISE RESOLVING: about to emit serverRes', eventObj)
    // eventObj.id = Math.ceil(Math.random() * 1000)
    socket.emit('serverRes', eventObj)
    return eventObj
  })
}
