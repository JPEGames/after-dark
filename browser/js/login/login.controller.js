app.controller('LoginCtrl', function ($scope, AuthService, $state, CharacterFactory, NavbarFactory, BunkerStateFactory) {
  $scope.login = {}
  $scope.error = null
  $scope.hasBunker
  $scope.hasCharacter

  $scope.sendLogin = function (loginInfo) {
    $scope.error = null

    AuthService.login(loginInfo).then(function () {
      return AuthService.getLoggedInUser()
    })
      .then(user => {
        return BunkerStateFactory.getBunkerState(user.id)
      })
      .then(bunker => {
        console.log('BUNKER ON LOGIN: ', bunker)
        if (!bunker.noBunker) {
          $scope.hasBunker = true
        } else {
          $scope.hasBunker = false
        }
        return CharacterFactory.getCharacter()
      })
      .then(character => {
        console.log('CHARACTER ON LOGIN: ', character)
        if (!character.foundCharacter) $scope.hasCharacter = true
        else $scope.hasCharacter = false
        NavbarFactory.setter($scope.hasCharacter, $scope.hasBunker)
        console.log('hasCharacter login: ', $scope.hasCharacter, 'hasBunker login: ', $scope.hasBunker)
        if ($scope.hasCharacter && $scope.hasBunker) {
          console.log('GOING TO OVERVIEW ON LOGIN')
          $state.go('master.navbar.characterOverview')
        } else {
          if ($scope.hasCharacter && !$scope.hasBunker) {
            console.log('GOING TO BUNKER PROMPT ON LOGIN')
            $state.go('master.navbar.home')
          } else {
            console.log('GOING TO Char CREATE ON LOGIN')
            $state.go('master.navbar.characterCreate')
          }
        }
      })
      .catch(function (error) {
        console.log(error)
        $scope.error = 'Invalid login credentials OR no character'
      })
  }
})
