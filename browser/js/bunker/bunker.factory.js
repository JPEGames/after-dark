// for retrieving game state

app.factory('BunkerStateFactory', function ($http, ArFactory, $q, GeoFireFactory) {
  let BunkerStateFactory = {}

  // loads previously saved bunker state
  BunkerStateFactory.getBunkerState = (userId) => {
    return $http.get(`/api/bunkerstate/${userId}`)
      .then(res => res.data)
      .catch(() => {
        console.log('caught error')
        // useful for resolve in 'home' state - if noBunker is true, then display prompt
        return {noBunker: true}
      })
  }

  // create default bunker after user clicks 'Yes' after signup
  // prompt, stores current location in Firebase
  BunkerStateFactory.createBunker = (userId) => {
    return $q.all([$http.get(`/api/bunkerstate/${userId}/newBunker`),
      ArFactory.getCurrentPosition()])
      .then(res => {
        let bunkerID = res[0].data.id
        let pos = res[1]
        let geofied = {}
        geofied[bunkerID] = [pos.latitude, pos.longitude]
        return GeoFireFactory.set(geofied)
      }).then(console.log)
  }
  return BunkerStateFactory
})
