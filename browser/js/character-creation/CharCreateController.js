app.controller('CharCreateController', function ($scope, $state, CharacterFactory) {
  angular.extend($scope, {
    createCharacter: (character, desc) => {
      let newCharacter = {perk: character, description: desc}
      return CharacterFactory.createCharacter(newCharacter)
        .then(() => {
          $state.go('master.navbar.game')
        })
    }
  })
})
