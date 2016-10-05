'use strict'
var router = require('express').Router()
module.exports = router

router.use('/gamestate', require('./gamestate'))
router.use('/bunkerstate', require('./bunkerstate'))
router.use('/users', require('./users'))
router.use('/characters', require('./characters'))
// router.use('/members', require('./members'))

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
  res.status(404).end()
})
