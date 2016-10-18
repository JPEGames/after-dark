app.factory('CharOverFactory', function ($http, $rootScope, AuthService, BunkerStateFactory, EventFactory) {
  // <---- GLOBALS FOR CHARACTER INFORMATION --->
  let charStats
  let totalMoney
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
      title: 'Air',
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
    changeExp: function (experience) {
      return this.getCharacter()
        .then(character => {
          console.log('CHARACTER LEVEL: ', character.level)
          character.experience += experience
          console.log('UPDATED CHARACTER EXPERIENCE~~~~', character)
          return $http.put(`/api/characters/${character.userId}`, character)
        })
    },
    getResources: function () {
      return testResources
    },
    setResources: function (newResources) {
      testResources = newResources
    },
    getMoney: function () {
      return totalMoney
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
    },
    resourceGenerator: function (bunkerObj) {
      let resourceArr = []
      let bunkerResources
      let backpackResources
      let bunkerCapacities

      return AuthService.getLoggedInUser()
        .then(user => {
          return BunkerStateFactory.getBunkerState(user.id)
        })
        .then(bunker => {
          let {
            air, electricity, metal, water, money,
            airCapacity, waterCapacity, electricityCapacity, metalCapacity
          } = bunker
          bunkerResources = { air, electricity, metal, water }
          bunkerCapacities = { airCapacity, electricityCapacity, metalCapacity, waterCapacity }
          // TODO: implement this in $$ spot in overview
          // console.log('MONEY~~~', {money})
          // console.log(money)
          totalMoney = money
          // console.log('BUNKER RESOURCES: ', bunkerResources)
          // console.log('BUNKER MONEY!', totalMoney)
          return EventFactory.getBackpack()
        })
        .then(backpack => {
          let { air, electricity, metal, water } = backpack
          backpackResources = { air, electricity, metal, water }
          return Object.keys(bunkerResources).map(resource => {
            return {
              title: `${resource.substring(0, 1).toUpperCase()}${resource.substring(1)}`,
              source: `pimages/${resource}.png`,
              bquantity: bunkerResources[ resource ],
              bmax: bunkerCapacities[ `${resource}Capacity` ],
              myBProgress: { 'width': `${bunkerResources[ resource ] / bunkerCapacities[ `${resource}Capacity` ] * 100}%` },
              pquantity: backpackResources[ resource ],
              pmax: 100,
              myPProgress: { 'width': `${backpackResources[ resource ]}%` }
            }
          })
        })
    }
  }
})
