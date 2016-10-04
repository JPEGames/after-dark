const Sequelize = require('sequelize')

const db = require('../../_db')

module.exports = db.define('character', {
  perk: {
    type: Sequelize.ENUM('miner', 'scientist', 'soldier'),
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    defaultValue: ''
  }
})
