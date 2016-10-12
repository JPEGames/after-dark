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
    return ArFactory.getCurrentPosition()
      .then(pos => {
        return $http.post(`/api/bunkerstate/${userId}`, pos)
      }).then(res => res.data)
      .catch(console.warn)
  }
  // get user associated with clicked-on bunker
  BunkerStateFactory.getBunkerUser = (bunkerId) => {
    return $http.get(`/api/bunkerstate/getUserName/${bunkerId}`)
      .then(res => res.data)
  }
  return BunkerStateFactory
})
