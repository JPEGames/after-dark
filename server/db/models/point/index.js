const Sequelize = require('sequelize')
const db = require('../../_db')
const GeoFire = require('geofire')
const geofire = new GeoFire(require('../../firebase').child('locations'))

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
      afterCreate: function () {
        let randomized = require('./eventConnector')(this)
        if (randomized.event) return geofire.set(`${this.event}_${this.id}`, [])
        return
      }
    }
  })
