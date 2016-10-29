// <-- ROUTING FOR BUNKER -->

const db = require('../../../db')
const Bunker = db.model('bunker')
const User = db.model('user')
const GeoFire = require('geofire')
const firebaseRef = require('../../../db/firebase')
let geofireRef = new GeoFire(firebaseRef.child('locations'))
module.exports = function (getIO) {
  const router = require('express').Router()

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
  router.get('/getUserName/:bunkerId', function (req, res, next) {
    Bunker.findById(req.params.bunkerId, {include: [User]})
      .then(bunker => {
        if (!bunker) {
          let err = new Error('not found')
          err.status = 404
          next(err)
        } else {
          res.send(bunker.user.username)
        }
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
        if (!userBunker) {
          res.send({noBunker: true})
        } else {
          // TODO: this interferes with hasBunker - socket connects slower than resolve on nav-bar state
          // getIO().communicate({id: req.requestedUser.id}, 'test', {})
          // console.log('SENDING BUNKER UP')
          res.send(userBunker)
        }
      })
      .catch(next)
  })

  // makes new bunker
  router.post('/:id', function (req, res, next) {
    // associates bunker with recently signed-up user
    req.body.userId = req.user.id
    Bunker.create(req.body)
      .then(newBunker => {
        if (!newBunker) res.sendStatus(404)
        // update firebase locations with new bunker
        let bunkerCoordinates = [parseFloat(newBunker.lat), parseFloat(newBunker.lng)]
        geofireRef.set(`bunker_${newBunker.id}`, bunkerCoordinates)
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
  router.put('/depositResources/:id', function (req, res, next) {
    Bunker.findOne({
      userId: req.requestedUser.id
    })
      .then(userBunker => {
        if (!userBunker) {
          let err = new Error('bunker not found')
          err.status = 404
          next(err)
        } else {
          return userBunker.update(req.body)
        }
      })
      .then((updatedBunker) => {
        console.log('updated bunker: ', updatedBunker)
        res.sendStatus(204)
      })
      .catch(next)
  })
  return router
}
