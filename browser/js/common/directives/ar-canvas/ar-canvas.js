window.createGameAR = function (ele, scope, players, mapId, injector) {
  // let height = parseInt(ele.css('height'), 10)
  // let width = parseInt(ele.css('width'), 10)

  var gameAR = new Phaser.Game(960, 600, Phaser.CANVAS, 'ar-canvas', { preload: preload, create: create, update: update, render: render }, true)

  scope.$on('$destroy', () => {
    gameAR.destroy()
  })

  var randCount = 180
  var randFrequency = 180
  var randOn = true
  var cloudArray = []

  function preload () {
    gameAR.load.image('cloud', '/pimages/cloud2.png')
  }

  function create () {
    gameAR.physics.startSystem(Phaser.Physics.ARCADE)
  }

  function update () {
    randCount++
    if (randCount >= randFrequency && randOn) {
      deleteClouds()
      cloudRing()
      randCount = 0
    }
  }

  function render () {
  }

  function createACloud (x, y, width, height) {
    let tempSprite = gameAR.add.sprite(x, y, 'cloud')
    tempSprite.scale.setTo(width, height)
    cloudArray.push(tempSprite)
  }

  function deleteClouds () {
    cloudArray.forEach(function (cloud) {
      cloud.destroy()
    })
  }

  function cloudRing (cloudNum = 20) {
    for (let i = 0; i < cloudNum; i++) {
      // If width and height are left out of createACloud - this will create a ring around the center.
      let x = (gameAR.world.width / 5) + (gameAR.world.width - (Math.random() * 100) - 300) * Math.cos(2 * Math.PI * i / cloudNum)
      let y = (gameAR.world.height / 10) - (gameAR.world.height - (Math.random() * 100) - 175) * Math.sin(2 * Math.PI * i / cloudNum)
      createACloud(x, y, 1, 1)
    }
  }
}

// custom directive to link phaser object to angular
app.directive('arCanvas', function ($injector) {
  return {
    scope: {
      data: '=',
      mapId: '='
    },
    template: '<div id="ar-canvas"></div>',
    link: function (scope, ele, attrs) {
      // condition for state transition into ar view
      scope.center = {
        lat: 42,
        lng: -71,
        zoom: 12,
        autodiscover: true
      }
      if (scope.data) {
        window.createGameAR(ele, scope, scope.players, scope.mapId, $injector)
      }
    }
  }
})
