const router = require('express').Router()
const GameState = require('../../../db').model('gamestate')
const objectify = require('./calculations')
module.exports = router
router.get('/', function (req, res, next) {
  if (req.user) {
    GameState.findOne({where: {userId: req.user.id}})
      .then(state => objectify(state))
      .then(object => res.json(object))
      .catch(console.log)
  } else {
    res.sendStatus(401)
  }
})
