app.factory('EventFactory', function ($http, AuthService, FbFactory, GeoFireFactory) {
  let EventFactory = {}
  const resources = ['scrap metal', 'H2O']

  // adds resource to database
  EventFactory.resourceToBackpack = (eventData) => {
    if (resources.includes(eventData.type)) {
      console.log('in backpack: ', eventData.type)
      // return $http.put()
    }
  }
  return EventFactory
})
