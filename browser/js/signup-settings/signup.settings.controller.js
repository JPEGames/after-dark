app.controller('SignupSettingsCtrl', function ($scope, AuthService, $state, SignupSettingsFactory) {
  $scope.week = [
    {selected: false, name: 'Mo', number: 0},
    {selected: false, name: 'Tu', number: 1},
    {selected: false, name: 'We', number: 2},
    {selected: false, name: 'Th', number: 3},
    {selected: false, name: 'Fr', number: 4},
    {selected: false, name: 'Sa', number: 5},
    {selected: false, name: 'Su', number: 6}
  ]

  $scope.isOptionsRequired = function () {
    return $scope.week.some(function (options) {
      return options.selected
    })
  }

  $scope.createSettings = function (settingsInfo) {
    let myWorkdays = []

    $scope.week.forEach(function (elem) {
      if (elem.selected === true) {
        myWorkdays.push(elem.number)
      }
    })

    let toBeSent = {
      waketime: settingsInfo.waketime + ' AM',
      workdays: myWorkdays
    }

    SignupSettingsFactory.createSettings(toBeSent)
      .then(function (createdSettings) {
        $state.go('master.navbar.tasks')
      })
      .catch(function () {
        $scope.error = 'Could not create settings.'
        console.log('Error creating task.')
      })
  }
})
