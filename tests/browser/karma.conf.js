var path = require('path')

module.exports = function (config) {
  var filesCollection = [
    'node_modules/lodash/index.js',
    'node_modules/angular/angular.js',
    'node_modules/angular-animate/angular-animate.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js',
    'node_modules/angular-ui-bootstrap/ui-bootstrap.js',
    'node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js',
    'node_modules/socket.io-client/socket.io.js',
    'node_modules/sinon/pkg/sinon.js',
    'node_modules/angular-mocks/angular-mocks.js',
    'node_modules/ngstorage/ngStorage.min.js',
    'node_modules/firebase/firebase.js',
    'node_modules/leaflet/dist/leaflet.js',
    'node_modules/angular-simple-logger/dist/angular-simple-logger.js',
    'node_modules/ui-leaflet/dist/ui-leaflet.js',
    'browser/js/app.js',
    'public/main.js',
    'tests/browser/**/*.js'
  ]

  var excludeFiles = [
    'tests/browser/karma.conf.js'
  ]

  var configObj = {
    browsers: ['Chrome'],
    frameworks: ['mocha', 'chai'],
    basePath: path.join(__dirname, '../../'),
    files: filesCollection,
    exclude: excludeFiles,
    reporters: ['mocha', 'coverage'],
    preprocessors: {
      'public/main.js': 'coverage'
    },
    coverageReporter: {
      dir: 'coverage/browser/',
      reporters: [{
        type: 'text',
        subdir: '.'
      }, {
        type: 'html',
        subdir: '.'
      }]
    }
  }

  config.set(configObj)
}
