const Bunker = require('../db/models/bunker')
const Sequelize = require('sequelize')
const calculations = require('../app/routes/gamestate/calculations')
const _ = require('lodash')

function resourceCheck (userId) {
  Bunker.find({where: {userId}})
    .then(bunker => {
    })
}

module.exports = {}
