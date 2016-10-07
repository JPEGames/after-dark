const Sequelize = require('sequelize')
const db = require('../../_db')

module.exports = db.define('point', {
  lat: {
    type: Sequelize.DECIMAL,
    allowNull: false
  },
  lng: {
    type: Sequelize.DECIMAL,
    allowNull: false
  },
  event: {
    type: Sequelize.STRING,
    defaultValue: 'none'
  }
},
  {
    hooks: {
      afterCreate: function (point) {}
    }

  })
