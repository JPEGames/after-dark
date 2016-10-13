const Bunker = require('../db/models/bunker')
const Sequelize = require('sequelize')
const calculations = require('../app/routes/gamestate/calculations')
const _ = require('lodash')
module.exports = {}
function resourceCheck (upgradeReqs, id) {
  Bunker.find({
    where: {
      userId: id
    }
  })
    .then(bunker => {
      let resources = calculations(Bunker)
      // for (let resource in resources) {
      //
      // }
    })
}
