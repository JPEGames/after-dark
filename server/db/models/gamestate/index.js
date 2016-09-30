var Sequelize = require('sequelize')

var db = require('../../_db')

module.exports = db.define('gamestate', {
  money: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  air: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  electricity: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  water: {
    type: Sequelize.INTEGER,
    defaultValue: 0
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
    defaultValue: 1
  },
  electricityCapacity: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  waterCapacity: {
    type: Sequelize.INTEGER,
    defaultValue: 1
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
    defaultValue: [0.25, 0.25, 0.25, 0.25]
  }
})
