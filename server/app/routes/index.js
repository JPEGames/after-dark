'use strict'
module.exports = function (getIO) {
  var router = require('express').Router()
  router.use('/gamestate', require('./gamestate'))
  router.use('/bunkerstate', require('./bunkerstate')(getIO))
  router.use('/characters', require('./characters')(getIO))
  router.use('/grid', require('./grid'))
  router.use('/backpack', require('./backpack'))
  router.use('/events', require('./events')(getIO))
  router.use('/points', require('./point')(getIO))

  // Make sure this is after all of
  // the registered routes!
  router.use(function (req, res) {
    res.status(404).end()
  })
  return router
}
