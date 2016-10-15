app.controller('CharOverviewController', function ($scope, $state, NavbarFactory, CharacterFactory, myCharacter, $rootScope) {
  // ELIOT - BIT MESSY - need to decide where logic goes, directive or controller
  // right now its a mix.
  $scope.myChar = myCharacter
  console.log($scope.myChar)
  $scope.myLevel = 1
  $scope.myExpPer = '10%'
  $scope.myMaxExp = 100
  $scope.myExp = 10
  $scope.myProgress = {'width': $scope.myExpPer}
  let nameSplit = $scope.myChar.perk.split('')
  nameSplit[0] = nameSplit[0].toUpperCase()
  nameSplit = nameSplit.join('')
  $scope.myTitle = nameSplit
  $scope.myLocation = 'New York'

  NavbarFactory.setter(true, true)
  console.log('Forced hamburger menu to comply.')
  $rootScope.$broadcast('resetNavAuth')
})
