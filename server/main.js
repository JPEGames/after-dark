'use strict'
var chalk = require('chalk')
var db = require('./db')
var https = require('https')
var fs = require('fs')
var path = require('path')

// Create a node server instance! cOoL!
// var server = require('http').createServer()

var options = {
  key: fs.readFileSync(path.join(__dirname, '/../ssl/key.pem')),
  ca: fs.readFileSync(path.join(__dirname, '/../ssl/csr.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/../ssl/cert.pem'))
}

var app = require('./app')(db)
var PORT = process.env.PORT || 1337
var server = https.createServer(options)

var createApplication = function () {
  server.on('request', app) // Attach the Express application.
  // require('./io')(server) // Attach socket.io.
}

var startServer = server
 .listen(PORT, '', null, function () {
   console.log(chalk.blue('Server started on port', chalk.magenta(PORT)))
 })

// var startServer = function () {
//   var PORT = process.env.PORT || 1337

//   server.listen(PORT, function () {
//     console.log(chalk.blue('Server started on port', chalk.magenta(PORT)))
//   })
// }

db.sync()
  .then(createApplication)
  .then(startServer).catch(function (err) {
    console.error(chalk.red(err.stack))
  })
