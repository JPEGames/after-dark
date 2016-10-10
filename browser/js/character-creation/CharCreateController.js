app.controller('CharCreateController', function ($scope, $state, CharacterFactory) {
  angular.extend($scope, {
    // allows newly signed-up user to create their character
    // takes user to BUNKER view after
    createCharacter: (character, desc) => {
      let newCharacter = {perk: character, description: desc}
      return CharacterFactory.createCharacter(newCharacter)
        .then(() => {
          $state.go('master.navbar.home')
        })
    }
  })
})
