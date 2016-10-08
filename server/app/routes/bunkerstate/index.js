// <-- ROUTING FOR BUNKER -->
const router = require('express').Router()
const db = require('../../../db')
const Bunker = db.model('bunker')
const User = db.model('user')
const GeoFire = require('geofire')
const firebaseRef = require('../../../db/firebase')
let geofireRef = new GeoFire(firebaseRef.child('locations'))
module.exports = router

// for getting bunker associated with logged-in user
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

// for loading previously saved bunker state
router.get('/:id', function (req, res, next) {
  Bunker.findOne({
    where: {
      userId: req.requestedUser.id
    }
  })
    .then(userBunker => {
      if (!userBunker) res.sendStatus(404)
      else res.send(userBunker)
    })
    .catch(next)
})

// makes new bunker
router.post('/', (req, res, next) => {
  res.end()
})
router.post('/:id', function (req, res, next) {
  Bunker.create(req.body)
    .then(newBunker => {
      if (!newBunker) res.sendStatus(404)
      // geofireRef.set(`bunker_${newBunker.id}`, newBunker)
      res.send(newBunker)
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
