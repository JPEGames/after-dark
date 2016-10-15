app.factory('CharOverFactory', function ($http, $rootScope, AuthService) {
  // <---- GLOBALS FOR CHARACTER INFORMATION --->
  let charStats
  let charResources

  let testResources = [
    {
      title: 'Metal',
      bquantity: 35,
      bmax: 100,
      myBProgress: { 'width': 35 + '%' },
      pquantity: 12,
      pmax: 100,
      myPProgress: { 'width': 12 + '%' }
    },
    {
      title: 'Oxygen',
      bquantity: 55,
      bmax: 100,
      myBProgress: { 'width': 55 + '%' },
      pquantity: 3,
      pmax: 100,
      myPProgress: { 'width': 3 + '%' }
    },
    {
      title: 'Water',
      bquantity: 91,
      bmax: 100,
      myBProgress: { 'width': 91 + '%' },
      pquantity: 24,
      pmax: 100,
      myPProgress: { 'width': 24 + '%' }
    },
    {
      title: 'Electricity',
      bquantity: 51,
      bmax: 100,
      myBProgress: { 'width': 51 + '%' },
      pquantity: 8,
      pmax: 100,
      myPProgress: { 'width': 8 + '%' }
    }
  ]
  let testMoney = 1765.3465
  let testStats = [
    {
      title: 'Strength',
      level: 15,
      myProgress: { 'width': 15 + '%' }
    },
    {
      title: 'Endurance',
      level: 17,
      myProgress: { 'width': 17 + '%' }
    },
    {
      title: 'Perception',
      level: 7,
      myProgress: { 'width': 7 + '%' }
    },
    {
      title: 'Luck',
      level: 1,
      myProgress: { 'width': 1 + '%' }
    },
    {
      title: 'Intelligence',
      level: 21,
      myProgress: { 'width': 21 + '%' }
    },
    {
      title: 'Tinkering',
      level: 10,
      myProgress: { 'width': 10 + '%' }
    }
  ]

  return {
    getCharacter: function () {
      return AuthService.getLoggedInUser()
        .then(user => {
          return $http.get(`/api/characters/${user.id}`)
        })
        .then(res => {
          charStats = res.data
          return res.data
        })
    },
    getStats: function () {
      return charStats
    },
    setStats: function (newStats) {
      testStats = newStats
    },
    getResources: function () {
      return testResources
    },
    setResources: function (newResources) {
      testResources = newResources
    },
    getMoney: function () {
      return testMoney
    },
    setMoney: function (newMoney) {
      testMoney = newMoney
    },
    statConverter: function (statObj) {
      let statArr = []
      Object.keys(statObj).forEach(stat => {
        statArr.push({
          title: `${stat.substring(0, 1).toUpperCase()}${stat.substring(1)}`,
          level: statObj[ stat ],
          myProgress: { 'width': `${statObj[ stat ]}%` }
        })
      })
      return statArr
    }
  }
})
