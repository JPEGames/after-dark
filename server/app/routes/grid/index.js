const router = require('express').Router()
const db = require('../../../db')
const Point = db.model('point')
const User = db.model('user')
module.exports = router

router.post('/', function (req, res, next) {
  let grid = req.body.grid.map(point => Point.findOrCreate(point))
  console.log(grid)
  res.send({visited: []})
})
