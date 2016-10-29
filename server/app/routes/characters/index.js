// <-- ROUTING FOR CHARACTERS -->
const db = require('../../../db')
const Character = db.model('character')
const User = db.model('user')
module.exports = function (getIO) {
  const router = require('express').Router()

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
  })

  router.get('/:id', function (req, res, next) {
    Character.findOne({
      where: {
        userId: req.requestedUser.id
      }
    })
      .then(userCharacter => {
        if (!userCharacter) {
          res.send({ foundCharacter: false })
        } else {
          res.send(userCharacter)
        }
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

  router.put('/:id', function (req, res, next) {
    Character.findOne({
      where: {
        userId: req.requestedUser.id
      }
    })
        .then(userCharacter => {
          if (!userCharacter) {
            let err = new Error('character not found')
            err.status = 404
            next(err)
          } else {
            return userCharacter.update(req.body)
              .then(updatedCharacter => {
                console.log('updated character!', updatedCharacter)
                res.send(updatedCharacter)
              })
          }
        })
  }
  )
  return router
}
