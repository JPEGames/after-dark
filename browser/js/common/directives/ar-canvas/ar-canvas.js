window.createGameAR = function (ele, scope, players, mapId, injector) {
  // let height = parseInt(ele.css('height'), 10)
  // let width = parseInt(ele.css('width'), 10)

  const gameAR = new Phaser.Game(960, 600, Phaser.AUTO, 'ar-canvas', { preload: preload, create: create, update: update, render: render }, true)

  scope.$on('$destroy', () => {
    gameAR.destroy()
  })

  const testObj = [{
    pos: {
      x: 0.50,
      y: 0.50
    },
    type: 'bunker'
  },
    {
      pos: {
        x: 0.25,
        y: 0.25
      },
      type: 'bunker'
    },
    {
      pos: {
        x: 0.75,
        y: 0.75
      },
      type: 'bunker'
    }]
  let ranTest = false

  let randCount = 180
  let randFrequency = 180
  let randOn = true
  let cloudArray = []
  let markerArray = []
  let markerLayer, graphicsLayer

  function preload () {
    gameAR.load.image('cloud', '/pimages/cloud2.png')
    gameAR.load.image('bunker', '/pimages/vault.png')
  }

  function create () {
    markerLayer = gameAR.add.group()
    markerLayer.z = 0
    graphicsLayer = gameAR.add.group()
    graphicsLayer.z = 1
    gameAR.physics.startSystem(Phaser.Physics.ARCADE)
  // gameAR.inputEnabled = true
  // gameAR.input.onDown.add(testMarker, this)
  }

  function update () {
    randCount++
    if (randCount >= randFrequency && randOn) {
      deleteClouds()
      cloudRing()
      randCount = 0
    }
    if (!ranTest) {
      addMarkers(testObj)
      ranTest = true
    }
  }

  function render () {
  }

  // HELPER FUNCTIONS

  function testMarker () {
    addAMarker(gameAR.input.activePointer.worldX, gameAR.input.activePointer.worldY, 0.3, 0.3, 'bunker')
  }

  function addMarkers (anArray) {
    anArray.forEach(function (newMark) {
      let perToX = newMark.pos.x * gameAR.world.width
      let perToY = newMark.pos.y * gameAR.world.height
      addAMarker(perToX, perToY, 0.3, 0.3, newMark.type)
    })
  }

  function clearMarkers () {
    markerArray.forEach(function (delMark) {
      delMark.destroy()
    })
  }

  function addAMarker (x, y, width, height, type) {
    let tempSprite
    if (type === 'bunker') {
      tempSprite = new Phaser.Sprite(gameAR, x - 20, y - 20, 'bunker')
    }
    markerLayer.add(tempSprite)
    tempSprite.scale.setTo(width, height)
    tempSprite.inputEnabled = true
    tempSprite.events.onInputDown.add(markerPress, this)
    markerArray.push(tempSprite)
  }

  function markerPress (sprite, pointer) {
    console.log(sprite)
  }

  function createACloud (x, y, width, height) {
    let tempSprite = new Phaser.Sprite(gameAR, x, y, 'cloud')
    graphicsLayer.add(tempSprite)
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

  function pauseGame () {
    gameAR.paused = true
  }

  function resumeGame () {
    gameAR.paused = false
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
