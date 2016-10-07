'use strict'
const db = require('./_db')
module.exports = db

const User = require('./models/user')
const GameState = require('./models/gamestate')
const Bunker = require('./models/bunker')
const Character = require('./models/character')
const Point = require('./models/point')

// Associations
GameState.belongsTo(User)
Bunker.belongsTo(User)
Character.belongsTo(User)
Point.belongsToMany(Point, {through: 'visited'})
User.belongsToMany(Point, {through: 'visited'})
