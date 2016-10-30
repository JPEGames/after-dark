var path = require('path')
var Sequelize = require('sequelize')

var env = require(path.join(__dirname, '../env'))
var db = new Sequelize('PostCiv', null, null, { host: 'localhost', dialect: 'postgres', logging: env.LOGGING })

module.exports = db
