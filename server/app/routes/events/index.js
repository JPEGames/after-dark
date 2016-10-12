// <-- ROUTING FOR EVENTS -->
const db = require('../../../db')
// const User = db.model('user')
const Events = db.model('events')

module.exports = function (getIO) {
  const router = require('express').Router()

  router.get('/:id', function (req, res, next) {
    Events.findById(req.params.id)
      .then(foundEvent => {
        if (!foundEvent) {
          res.sendStatus(404)
        } else {
          res.send(foundEvent)
        }
      })
      .catch(next)
  })
  router.post('/', function (req, res, next) {
    Events.findOrCreate({
      where: {
        id: req.body.id,
        event: req.body.type
      }
    })
      .then(results => {
        res.send(results[ 0 ])
      })
      .catch(next)
  })
  return router
}
