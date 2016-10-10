'use strict'
var path = require('path')
var chalk = require('chalk')
var util = require('util')

var rootPath = path.join(__dirname, '../../../')
var indexPath = path.join(rootPath, './server/app/views/index.html')
var faviconPath = path.join(rootPath, './server/app/views/favicon.ico')

var env = require(path.join(rootPath, './server/env'))

var logMiddleware = require('volleyball')

module.exports = function (app) {
  app.setValue('env', env)
  app.setValue('projectRoot', rootPath)
  app.setValue('indexHTMLPath', indexPath)
  app.setValue('faviconPath', faviconPath)
  app.setValue('log', logMiddleware)
}
