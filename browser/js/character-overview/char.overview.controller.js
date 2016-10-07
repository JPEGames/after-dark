app.controller('CharOverviewController', function ($scope, $state, CharacterFactory, myCharacter) {
  $scope.myChar = myCharacter
  console.log($scope.myChar)
// myChar.perk lol
})
