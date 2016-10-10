// <-- ROUTING FOR CHARACTERS -->
const router = require('express').Router()
const db = require('../../../db')
const Character = db.model('character')
const User = db.model('user')
module.exports = router

router.param('id', function (req, res, next, id) {
  User.findById(id)
    .then(foundUser => {
      !foundUser ? res.sendStatus(404) : req.requestedUser = foundUser.sanitize()
      next()
    })
})

router.get('/:id', function (req, res, next) {
  Character.findOne({
    where: {
      userId: req.requestedUser.id
    }
  })
    .then(userCharacter => {
      !userCharacter ? res.send({foundCharacter: false}) : res.send(userCharacter)
    })
    .catch(next)
})

router.post('/:id', function (req, res, next) {
  Character.create(req.body)
    .then(newCharacter => {
      !newCharacter ? res.sendStatus(500) : res.send(newCharacter)
    })
    .catch(next)
})

