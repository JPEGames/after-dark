const Bunker = require('../db/models/bunker')
const Sequelize = require('sequelize')
module.exports = {}
function resourceCheck (bunkerResourceObj, id) {
  Bunker.find({
    where: {
      userId: id
    }
  })
    .then(bunker => {

        })
}
