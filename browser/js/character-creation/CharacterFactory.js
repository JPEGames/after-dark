app.factory('CharacterFactory', function ($http, AuthService) {
  let CharacterFactory = {}
  CharacterFactory.getCharacter = () => {
    return AuthService.getLoggedInUser()
      .then(user => {
        return $http.get(`/api/characters/${user.id}`)
      })
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
