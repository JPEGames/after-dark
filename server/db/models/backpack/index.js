const Sequelize = require('sequelize')
const db = require('../../_db')

module.exports = db.define('backpack', {
  air: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      max: 100
    }
  },
  electricity: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      max: 100
    }
  },
  water: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      max: 100
    }
  },
  money: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      max: 100
    }
  },
  metal: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      max: 100
    }
  }
})
