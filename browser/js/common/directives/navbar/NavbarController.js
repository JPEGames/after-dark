app.controller('NavbarController', function ($state, $scope, AuthService, hasCharacter, hasBunker, NavbarFactory) {
  $scope.hasCharacter = false
  $scope.hasBunker = false
  if (hasCharacter.foundCharacter === false) {
    $scope.hasCharacter = false
  } else {
    $scope.hasCharacter = true
  }
  if (hasBunker.noBunker === true) {
    $scope.hasBunker = false
  } else {
    $scope.hasBunker = true
    $scope.bunkerId = hasBunker.id
  }

  NavbarFactory.setter($scope.hasCharacter, $scope.hasBunker)
  $state.go('master.navbar.home')
})
