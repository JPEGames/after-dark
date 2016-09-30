app.factory('SignupFactory', function ($http, $log, $q) {
  return {
    createUser: function (signupInfo) {
      return $http.post('/api/signup', signupInfo)
        .then(function () {
          return $q.resolve({message: 'User created!'})
        })
        .catch(function () {
          return $q.resolve({ message: 'Unable to create user.' })
        })
    }
  }
})
