const Sequelize = require('sequelize')
const db = require('../../_db')
const GeoFire = require('geofire')
const geofire = new GeoFire(require('../../firebase').child('locations'))
const eventConnector = require('./eventConnector')

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
    type: Sequelize.STRING
  }
},
  {
    hooks: {
      afterCreate: function (point) {
        let randomized = eventConnector(point)
        if (randomized.event) return geofire.set(`${point.event}_${point.id}`, [parseFloat(point.lat), parseFloat(point.lng)])
        return
      }
    }
  })
