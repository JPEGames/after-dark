app.factory('CharOverFactory', function ($http, $rootScope, AuthService) {
  let CharOverFactory = {}
  CharOverFactory.getStats = () => {
    return AuthService.getLoggedInUser()
      .then(user => {
        return $http.get(`/api/characters/${user.id}`)
      })
      .then(character => {
        console.log('got Character!', character)
      })
  }
  return CharOverFactory
  // let testStats = [
  //   {
  //     title: 'Strength',
  //     level: 15,
  //     myProgress: { 'width': 15 + '%' }
  //   },
  //   {
  //     title: 'Endurance',
  //     level: 17,
  //     myProgress: { 'width': 17 + '%' }
  //   },
  //   {
  //     title: 'Perception',
  //     level: 7,
  //     myProgress: { 'width': 7 + '%' }
  //   },
  //   {
  //     title: 'Luck',
  //     level: 1,
  //     myProgress: { 'width': 1 + '%' }
  //   },
  //   {
  //     title: 'Intelligence',
  //     level: 21,
  //     myProgress: { 'width': 21 + '%' }
  //   },
  //   {
  //     title: 'Tinkering',
  //     level: 10,
  //     myProgress: { 'width': 10 + '%' }
  //   }
  // ]
  // return {
  //   getStats: function () {
  //     return $http
  //   }
  // }
})
