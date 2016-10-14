app.factory('CharOverFactory', function () {
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
    getStats: function () {
      return testStats
    }
  }
})
