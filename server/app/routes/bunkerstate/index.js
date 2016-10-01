// <-- ROUTING FOR BUNKER -->
const router = require('express').Router()
const db = require('../../../db')
const Bunker = db.model('bunker')
const User = db.model('user')
module.exports = router

// for getting bunker associated with logged-in user
router.param('id', function (req, res, next, id) {
  User.findById(id)
    .then(foundUser => {
      !foundUser ? res.sendStatus(404) : req.requestedUser = foundUser.sanitize()
      next()
    })
})

router.get('/:id', function (req, res, next) {
  Bunker.findOne({
    where: {
      userId: req.requestedUser.id
    }
  })
    .then(userBunker => {
      !userBunker ? res.sendStatus(404) : res.send(userBunker)
    })
    .catch(next)
})

// update savedBunkerState column in bunker model (upgrades etc. in Phaser)
router.put('/:id', function (req, res, next) {
  Bunker.findOne({
    where: {
      userId: req.requestedUser.id
    }
  })
    .then(userBunker => {
      if (!userBunker) {
        res.sendStatus(404)
      } else {
        userBunker.updateAttributes({ savedBunkerState: req.body })
        res.send(userBunker)
      }
    })
    .catch(next)
})
