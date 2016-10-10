// <-- ROUTING FOR BACKPACK -->
const router = require('express').Router()
const db = require('../../../db')
const User = db.model('user')
const Backpack = db.model('backpack')
module.exports = router

router.param('id', function (req, res, next, id) {
  User.findById(id)
    .then(foundUser => {
      if (!foundUser) {
        res.sendStatus(404)
      } else {
        req.requestedUser = foundUser.sanitize()
      }
      next()
    })
    .catch(next)
})

router.get('/:id', function (req, res, next) {
  Backpack.findOne({
    where: {
      userId: req.requestedUser.id
    }
  })
    .then(foundBackpack => {
      if (!foundBackpack) {
        res.sendStatus(404)
      } else {
        res.send(foundBackpack)
      }
    })
    .catch(next)
})

router.put('/:id', function (req, res, next) {
  Backpack.findOne({
    where: {
      userId: req.requestedUser.id
    }
  })
    .then(foundBackpack => {
      return foundBackpack.update(req.body)
    })
    .then(updatedBackpack => {
      res.send(updatedBackpack)
    })
    .catch(next)
})
