app.factory('EventFactory', function ($http, AuthService, FbFactory, GeoFireFactory) {
  let EventFactory = {}
  const resources = [ 'metal', 'water', 'electricity', 'air' ]

  // adds resource to database, send backpack back to front
  EventFactory.resourceToBackpack = (eventData) => {
    if (resources.includes(eventData.type)) {
      console.log('in backpack: ', eventData.type)
      return AuthService.getLoggedInUser()
        .then(user => {
          return $http.get(`/api/backpack/${user.id}`)
            .then(res => {
              var userPack = res.data
              userPack[ eventData.type ]++
              return $http.put(`api/backpack/${user.id}`, userPack)
                .then(res => res.data)
            })
        })
    }
  }
  return EventFactory
})
