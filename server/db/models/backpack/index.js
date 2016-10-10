const Sequelize = require('sequelize')
const db = require('../../_db')

module.exports = db.define('backpack', {
  air: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  electricity: {
    type: Sequelize.INTEGER
    defaultValue: 0
  }
})