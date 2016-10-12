const Sequelize = require('sequelize')
const db = require('../../_db')

module.exports = db.define('upgrades', {
  airProduction: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  electricityProduction: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  waterProduction: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  defence: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})
