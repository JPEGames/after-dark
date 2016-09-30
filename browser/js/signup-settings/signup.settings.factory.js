app.factory('SignupSettingsFactory', function ($http, $log, $q) {
  return {
    createSettings: function (settingsInfo) {
      return $http.post('/api/settings', settingsInfo)
        .then(function () {
          return $q.resolve({message: 'Settings created!'})
        })
        .catch(function () {
          return $q.resolve({ message: 'Unable to create settings.' })
        })
    }
  }
})
