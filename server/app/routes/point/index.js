// <-- ROUTING FOR EVENTS -->
const db = require('../../../db')
// const User = db.model('user')
const Points = db.model('point')
const firebaseRef = require('../../../db/firebase')
const GeoFire = require('geofire')
const geofireRef = new GeoFire(firebaseRef.child('locations'))

module.exports = function (getIO) {
  const router = require('express').Router()

  router.put('/:id', function (req, res, next) {
    Points.findById(req.params.id)
      .then(foundPoint => {
        if (!foundPoint) {
          let err = new Error('does not exist')
          err.status = 404
          next(err)
        } else {
          console.log(foundPoint)
          const FBkey = req.body.type + '_' + req.params.id
          console.log(FBkey)
          return geofireRef.remove(FBkey)
        }
      })
      .then(() => {
        res.sendStatus(201)
      })
      .catch(next)
  })
  return router
}
