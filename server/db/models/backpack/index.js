const Sequelize = require('sequelize')
const db = require('../../_db')

module.exports = db.define('backpack', {
  air: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      max: 2
    }
  },
  electricity: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      max: 2
    }
  },
  water: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      max: 20
    }
  },
  money: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      max: 20
    }
  },
  information: {
    type: Sequelize.JSONB
  },
  metal: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      max: 2
    }
  }
})
