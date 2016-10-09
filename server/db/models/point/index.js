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
      afterCreate: function (point) {
        // console.log('POINT BEING MODIFIED: ', point)
        let randomized = require('./eventConnector')(point)
        if (randomized.event !== 'none') return geofire.set(`${point.event}_${point.id}`, [parseFloat(point.lat), parseFloat(point.lng)])
        return
      }
    }
  })
