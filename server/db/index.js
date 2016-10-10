'use strict'
const db = require('./_db')
module.exports = db

const User = require('./models/user')
const GameState = require('./models/gamestate')
const Bunker = require('./models/bunker')
const Character = require('./models/character')
const Point = require('./models/point')
const Backpack = require('./models/backpack')

// Associations
GameState.belongsTo(User)
Bunker.belongsTo(User)
Character.belongsTo(User)
Point.belongsToMany(User, {through: 'visited'})
User.belongsToMany(Point, {through: 'visited'})
Backpack.belongsTo(User)
