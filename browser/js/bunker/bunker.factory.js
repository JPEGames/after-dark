// for retrieving game state

app.factory('BunkerStateFactory', function ($http, ArFactory, $q) {
  let BunkerStateFactory = {}

  // loads previously saved bunker state
  BunkerStateFactory.getBunkerState = (userId) => {
    return $http.get(`/api/bunkerstate/${userId}`)
      .then(res => res.data)
      .catch(() => {
        console.log('caught error')
        return {noBunker: true}
      })
  }

  // create default bunker after user clicks 'Yes' after signup
  // prompt
  BunkerStateFactory.createBunker = (userId) => {
    return $q.all([$http.get(`/api/bunkerstate/${userId}/newBunker`),
      ArFactory.getCurrentPosition()])
      .then(res => {
        console.log(res)
        let bunkerID = res[0].data.id
        let pos = res[1]
        console.log({bunkerID, pos})
      })
  }

  return BunkerStateFactory
})
