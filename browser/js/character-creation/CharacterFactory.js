app.factory('CharacterFactory', function ($http) {
  let CharacterFactory = {}
  CharacterFactory.getCharacter = (userId) => {
    return $http.get(`/api/characters/${userId}`)
      .then(res => res.data)
  }
  CharacterFactory.createCharacter = (character) => {
    return $http.post(`/api/characters/${character.userId}`, character)
      .then(res => res.data)
  }
  return CharacterFactory
})
