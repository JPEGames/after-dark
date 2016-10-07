const router = require('express').Router()
const db = require('../../../db')
const Point = db.model('point')
const User = db.model('user')
const co = require('co')
const cf = require('co-functional')
module.exports = router

router.post('/', function (req, res, next) {
  co(function * () { // async function use of yield means await
    let cornerLats = new Set(req.body.corners.map(elem => elem.lat.toString()))
    let cornerLngs = new Set(req.body.corners.map(elem => elem.lng.toString()))
    let grid = yield cf.map(function * (point) {
      let arr = yield Point.findOrCreate({where: {lat: point.lat, lng: point.lng}})
      let instance = arr[0] // geting out sequelize instance, don't care about created bool
      if (cornerLats.has(instance.lat) && cornerLngs.has(instance.lng)) {
        instance.addUser(req.user)
      }
      return instance.id
    }, req.body.grid)
    // console.log(grid.filter(elem => !elem))
    let visited = yield req.user.getPoints()
    // console.log(visited)
    visited = visited.map(point => grid.indexOf(point.id)).filter(elem => !!elem)
    res.send({visited})
  }).catch(console.log)
})
