module.exports = function (eventPromise, socket) {
  console.log('Calling sendEvent!')
  return eventPromise.then(eventObj => {
    console.log('PROMISE RESOLVING: about to emit serverRes', eventObj)
    socket.emit('serverRes', eventObj)
    return eventObj
  })
}
