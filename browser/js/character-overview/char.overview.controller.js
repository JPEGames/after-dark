app.controller('CharOverviewController', function ($scope, $state, CharacterFactory, myCharacter) {
  $scope.myChar = myCharacter
  console.log($scope.myChar)
  // myChar.perk lol
  $scope.myExpPer = '10%'
  $scope.myProgress = {'width': $scope.myExpPer}
  let nameSplit = $scope.myChar.perk.split('')
  nameSplit[0] = nameSplit[0].toUpperCase()
  nameSplit = nameSplit.join('')
  $scope.myTitle = nameSplit
  $scope.myLocation = 'New York'
})
