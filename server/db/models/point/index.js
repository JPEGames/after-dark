const Sequelize = require('sequelize')
const db = require('../../_db')

module.exports = db.define('point', {
  coordinates: {
    type: Sequelize.ARRAY(Sequelize.FLOAT),
    allowNull: false
  },
  event: {
    type: Sequelize.STRING,
    defaultValue: 'none'
  }
}, {
  hooks: {
    afterCreate: function (point) {

    }
  }
})