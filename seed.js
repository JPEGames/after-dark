/*
 This seed file is only a placeholder. It should be expanded and altered
 to fit the development of your application.
 It uses the same file the server uses to establish
 the database connection:
 --- server/db/index.js
 The name of the database used is set in your environment files:
 --- server/env/*
 This seed file has a safety check to see if you already have users
 in the database. If you are developing multiple applications with the
 fsg scaffolding, keep in mind that fsg always uses the same database
 name in the environment files.
 */

var chalk = require('chalk')
var db = require('./server/db')
var User = db.model('user')
var GameState = db.model('gamestate')
const Character = db.model('character')
var Promise = require('sequelize').Promise
const Firebase = require('./server/db/firebase/')

var seedUsers = function () {
  var users = [
    {
      email: 'testing@fsa.com',
      password: 'password'
    },
    {
      email: 'obama@gmail.com',
      password: 'potus'
    }
  ]

  var creatingUsers = users.map(function (userObj) {
    return User.create(userObj)
      .then(u => Character.create({perk: 'miner', userId: u.id}))
  })

  return Promise.all(creatingUsers)
}
Firebase.child('locations').remove()
  .then(() => Firebase.child('locations'))
  .then(() => db.sync({ force: true }))
  .then(function () {
    return seedUsers()
  })
  .then(function () {
    console.log(chalk.green('Seed successful!'))
    process.exit(0)
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })
