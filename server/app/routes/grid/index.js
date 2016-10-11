const router = require('express').Router()
const db = require('../../../db')
const Point = db.model('point')
const User = db.model('user')
const co = require('co')
const cf = require('co-functional')
module.exports = router

router.post('/', function (req, res, next) {
  co(function * () { // async function use of yield means await
    // convert coordinates of 4 closest points around user to string
    let cornerLats = new Set(req.body.corners.map(elem => elem.lat.toString()))
    let cornerLngs = new Set(req.body.corners.map(elem => elem.lng.toString()))

    // find or create all 400 points in created grid based on user location
    let grid = yield cf.map(function * (point) {
      let arr = yield Point.findOrCreate({where: {lat: point.lat, lng: point.lng}}).catch(console.log)
      let instance = arr[0] // geting out sequelize instance, don't care about created bool

      // if found/created point matches 4 corners around user, associate them
      // with user
      if (cornerLats.has(instance.lat) && cornerLngs.has(instance.lng)) {
        yield instance.addUser(req.user)
      }
      return instance.id
    }, req.body.grid)
    // console.log(grid.filter(elem => !elem))
    let visited = yield req.user.getPoints()
    // console.log('Visited: ', visited)
    //
    visited = visited.map(point => grid.indexOf(point.id)).filter(elem => elem >= 0)
    console.log('sending: ', visited)
    res.send({visited})
  }).catch(console.log)
})

router.put('/', function (req, res, next) {
  cf.map(function * (point) {
    let found = yield Point.findOne({where: point})
    yield found.addUser(req.user)
  }, req.body.newNearest)
    .then(() => res.sendStatus(201))
})
