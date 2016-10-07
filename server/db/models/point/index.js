const Sequelize = require('sequelize')
const db = require('../../_db')

module.exports = db.define('point', {
  lat: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  lng: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  event: {
    type: Sequelize.STRING,
    defaultValue: 'none'
  }
}, {
  hooks: {
    afterCreate: function (point) {}
  }
})
