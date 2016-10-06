window.createGameAR = function (ele, scope, players, mapId, injector) {
  // let height = parseInt(ele.css('height'), 10)
  // let width = parseInt(ele.css('width'), 10)

  const gameAR = new Phaser.Game(960, 600, Phaser.AUTO, 'ar-canvas', { preload: preload, create: create, update: update, render: render }, true)

  // Deals with canvas glitch involving invincible phaser instance.
  scope.$on('$destroy', () => {
    gameAR.destroy()
  })

  // To test markers - for this to be fully functional - the objects passed in will also need an id for us to use on the way back out, and an opacity to visually show if it is found or not.
  const testObj = [{
    pos: {
      x: 0.50,
      y: 0.50
    },
    type: 'bunker'
  // , found: false,
  // id: 1
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
  // Only allows test to run once.
  let ranTest = false

  // All this stuff has to do with creating a ring of clouds - again - a system that will change once we implement markers accurately.
  let randCount = 180
  let randFrequency = 180
  let randOn = true
  // Stores an array of sprite objects for clouds so that I can delete them at a later time.
  let cloudArray = []

  // Stores an array of sprite objects for markers so that I can delete them at a later time.
  let markerArray = []

  // The independent layers of markers or clouds - so that we can control depth.
  let markerLayer, graphicsLayer

  // Load in visual assets.
  function preload () {
    gameAR.load.image('cloud', '/pimages/cloud2.png')
    gameAR.load.image('bunker', '/pimages/vault.png')
  }

  // Create systems and assets.
  function create () {
    // The layers and their z-indexes.
    markerLayer = gameAR.add.group()
    markerLayer.z = 0
    graphicsLayer = gameAR.add.group()
    graphicsLayer.z = 1

    // Add physics system for future animation.
    gameAR.physics.startSystem(Phaser.Physics.ARCADE)
  // To add listener testing on mouse click.
  // gameAR.inputEnabled = true
  // gameAR.input.onDown.add(testMarker, this)
  }

  // What happens every 1/60th a second?
  function update () {
    // Increase counter for recreating clouds for shitty animation effect that needs work.
    randCount++
    // If the counter is above the set timer...
    if (randCount >= randFrequency && randOn) {
      // Delete the clouds,
      deleteClouds()
      // Recreate a new ring,
      cloudRing()
      // Reset timer.
      randCount = 0
    }

  // If I havent run a test on markers...
  // if (!ranTest) {
  // Add test markers.
  // addMarkers(testObj)
  // I've run the test.
  // ranTest = true
  // }
  }

  // For future animation effects.
  function render () {
  }

  // =======================================================================================================================
  // HELPER FUNCTIONS
  // =======================================================================================================================

  // Is a test listener to add a marker of choice to your mouse click location - good for testing visual assets.
  function testMarker () {
    addAMarker(gameAR.input.activePointer.worldX, gameAR.input.activePointer.worldY, 0.3, 0.3, 'bunker')
  }

  // Add an array of markers to the map.
  function addMarkers (anArray) {
    anArray.forEach(function (newMark) {
      let perToX = newMark.pos.x * gameAR.world.width
      let perToY = newMark.pos.y * gameAR.world.height
      addAMarker(perToX, perToY, 0.3, 0.3, newMark.type)
    })
  }

  // Clear all markers from the map.
  function clearMarkers () {
    markerArray.forEach(function (delMark) {
      delMark.destroy()
    })
  }

  // Add an individual marker to the map.
  function addAMarker (x, y, width, height, type, id, found) {
    let tempSprite
    if (type === 'bunker') {
      tempSprite = new Phaser.Sprite(gameAR, x - 20, y - 20, 'bunker')
    }
    markerLayer.add(tempSprite)
    tempSprite.scale.setTo(width, height)
    /*
    tempSprite.id = id
    if(found) {
      tempSprite.opacity = 0.5
    }
    */
    tempSprite.inputEnabled = true
    tempSprite.events.onInputDown.add(markerPress, this)
    markerArray.push(tempSprite)
  }

  // Listener on pressing a marker.
  function markerPress (sprite, pointer) {
    console.log(sprite)
  }

  // Create an individual cloud.
  function createACloud (x, y, width, height) {
    let tempSprite = new Phaser.Sprite(gameAR, x, y, 'cloud')
    graphicsLayer.add(tempSprite)
    tempSprite.scale.setTo(width, height)
    cloudArray.push(tempSprite)
  }

  // Delete all clouds.
  function deleteClouds () {
    cloudArray.forEach(function (cloud) {
      cloud.destroy()
    })
  }

  // Mathematically create cloud ring - hardcoded numbers are for weird anchor offset problem (i.e. center of objext is its top left)
  function cloudRing (cloudNum = 20) {
    for (let i = 0; i < cloudNum; i++) {
      // If width and height are left out of createACloud - this will create a ring around the center.
      let x = (gameAR.world.width / 5) + (gameAR.world.width - (Math.random() * 100) - 300) * Math.cos(2 * Math.PI * i / cloudNum)
      let y = (gameAR.world.height / 10) - (gameAR.world.height - (Math.random() * 100) - 175) * Math.sin(2 * Math.PI * i / cloudNum)
      createACloud(x, y, 1, 1)
    }
  }

  // pause game - dont see its purpose yet, but good to have.
  function pauseGame () {
    gameAR.paused = true
  }

  // resume game
  function resumeGame () {
    gameAR.paused = false
  }
}

// Part of a state that has an ARController as a parent - so broadcasts are available.
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
