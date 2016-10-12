const Sequelize = require('sequelize')
const db = require('../../_db')

module.exports = db.define('events', {
  event: {
    type: Sequelize.STRING,
    allowNull: false
  }
})
