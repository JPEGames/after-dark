app.factory('CharacterFactory', function ($http, AuthService) {
  let CharacterFactory = {}
  CharacterFactory.getCharacter = (userId) => {
    return $http.get(`/api/characters/${userId}`)
      .then(res => res.data)
  }
  CharacterFactory.createCharacter = (character) => {
    return AuthService.getLoggedInUser()
      .then(user => {
        character.userId = user.id
        return $http.post(`/api/characters/${user.id}`, character)
          .then(res => res.data)
      })
  }
  return CharacterFactory
})
