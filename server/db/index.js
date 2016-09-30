'use strict'
const db = require('./_db')
module.exports = db

const User = require('./models/user')
const GameState = require('./models/gamestate')

GameState.belongsTo(User)
