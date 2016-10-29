const Sequelize = require('sequelize')
const db = require('../../_db')

module.exports = db.define('bunker', {
  savedBunkerState: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: {}
  },
  lat: {
    type: Sequelize.DECIMAL,
    defaultValue: 0
  },
  lng: {
    type: Sequelize.DECIMAL,
    defaultValue: 0
  },
  money: {
    type: Sequelize.INTEGER,
    defaultValue: 500
  },
  metal: {
    type: Sequelize.INTEGER,
    defaultValue: 50
  },
  air: {
    type: Sequelize.INTEGER,
    defaultValue: 50
  },
  electricity: {
    type: Sequelize.INTEGER,
    defaultValue: 50
  },
  water: {
    type: Sequelize.INTEGER,
    defaultValue: 50
  },
  airProduction: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  electricityProduction: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  waterProduction: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  airCapacity: {
    type: Sequelize.INTEGER,
    defaultValue: 1000
  },
  electricityCapacity: {
    type: Sequelize.INTEGER,
    defaultValue: 1000
  },
  waterCapacity: {
    type: Sequelize.INTEGER,
    defaultValue: 1000
  },
  metalCapacity: {
    type: Sequelize.INTEGER,
    defaultValue: 1000
  },
  maxCpu: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  cpuUsage: {
    type: Sequelize.DECIMAL,
    defaultValue: 0
  },
  cpuAllocation: {
    type: Sequelize.ARRAY(Sequelize.DECIMAL),
    defaultValue: [ 0.25, 0.25, 0.25, 0.25 ]
  }
}, {
  instanceMethods: {
    subtract: function (type, amount) {
      this[type] -= amount
      return this
    },
    upgradeCapacity: function (type) {
      this[type] += 500
      return this
    }
  }
})
