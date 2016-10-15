window.createGameAR = function (ele, scope, players, mapId, injector, $interval, ModalFactory) {
  let height = scope.height
  let width = scope.width
  const centerShift = 20
  const gameAR = new Phaser.Game(width, height, Phaser.CANVAS, 'ar-canvas', { preload: preload, create: create, update: update, render: render }, true)

  // Deals with canvas glitch involving invincible phaser instance.
  scope.$on('$destroy', () => {
    gameAR.destroy()
  })

  // Attempt for responsiveness - does not work.
  /*
  $(window).resize(function () {
    gameAR.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
    gameAR.scale.refresh()
  })
  */

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

  let firstUpdate = true // only emits on first event cycle
  let firstBroadcast = true

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
    gameAR.load.image('metal', '/pimages/ore.png')
    gameAR.load.image('water', '/pimages/water.png')
    gameAR.load.image('air', '/pimages/oxygen.png')
    gameAR.load.image('electricity', '/pimages/electricity.png')
    gameAR.load.image('rat attack', '/pimages/rat-attack.png')
  }

  // Create systems and assets.
  function create () {
    // The layers and their z-indexes.
    markerLayer = gameAR.add.group()
    markerLayer.z = 0
    graphicsLayer = gameAR.add.group()
    graphicsLayer.z = 1

    gameAR.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT

    gameAR.scale.pageAlignHorizontally = true

    gameAR.scale.pageAlignVertically = true

    // Add physics system for future animation.
    gameAR.physics.startSystem(Phaser.Physics.ARCADE)
    // To add listener testing on mouse click.
    // gameAR.inputEnabled = true
    // gameAR.input.onDown.add(testMarker, this)
    createACloudGrid(mapToGrid())
  }

  // What happens every 1/60th a second?
  function update () {
    // Increase counter for recreating clouds for shitty animation effect that needs work.
    // randCount++
    // If the counter is above the set timer...
    /*
    if (randCount >= randFrequency && randOn) {
          // Delete the clouds,
          deleteClouds()
          // Recreate a new ring,
          cloudRing()
          // Reset timer.
          randCount = 0
        }
    */
    if (firstUpdate) {
      firstUpdate = false
      scope.$emit('PhaserReady')
    }
  // ELIOT - Forcing loading to work temporarily
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
    console.warn('ADDING MARKERS')
    anArray.forEach(function (newMark) {
      let perToX = newMark.pos.x * gameAR.world.width
      let perToY = newMark.pos.y * gameAR.world.height
      addAMarker(perToX, perToY, 0.3, 0.3, newMark.type, newMark.id)
    })
  }

  // Clear all markers from the map.
  function clearMarkers () {
    markerArray.forEach(function (delMark) {
      delMark.destroy()
    })
  }

  // HELPER FUNCTION FOR addAMarker()
  function markerSetter (markerType, id, xCoord, yCoord) {
    // let imageType
    console.log('MARKER TYPE: ', markerType)
    // TODO: THIS IS TEMPORARY! should be just imageType = markerType
    // markerType !== 'bunker' ? imageType = 'ore' : imageType = markerType
    let sprite = new Phaser.Sprite(gameAR, xCoord - centerShift, yCoord - centerShift, markerType)
    sprite['markerType'] = markerType
    sprite['id'] = id
    return sprite
  }
  // TODO: need to add ID to tempSprite
  // Add an individual marker to the map.
  function addAMarker (xCoord, yCoord, width, height, type, id, found) {
    let tempSprite
    let [x, y] = [xCoord, yCoord]
    tempSprite = markerSetter(type, id, x, y)
    // console.log('Attempting to add marker!')
    // console.log(type)
    tempSprite['markerType'] = type
    // console.log('SPRITE AFTER TYPE: ', tempSprite['markerType'])
    markerLayer.add(tempSprite)
    if (type === 'bunker') {
      tempSprite.scale.setTo(width, height)
    } else {
      tempSprite.scale.setTo(0.1, 0.1)
    }
    /*

    if(found) {
      tempSprite.opacity = 0.5
    }
    */
    tempSprite.inputEnabled = true
    tempSprite.events.onInputDown.add(markerPress, this)
    markerArray.push(tempSprite)
  }

  function spaceMarker (x, y) {
    let spacing = 30
    markerArray.forEach(a => {
      let horizDir = Math.random() < 0.5 ? -1 : 1
      let vertDir = Math.random() < 0.5 ? -1 : 1
      while (Math.abs(a.x + centerShift - x) < spacing) x += horizDir
      while (Math.abs(a.y + centerShift - y) < spacing) y += vertDir
    })
    return [x, y]
  }

  // Listener on pressing a marker.
  function markerPress (sprite, pointer) {
    console.log('ON PRESS TYPE: ', sprite['markerType'])
    // send event type and id upon click
    if (sprite['markerType'] === 'rat attack') {
      scope.$emit('fight', {type: sprite['markerType'], id: sprite['id'], dangerLvl: 1})
      console.log('SPRITE ID FOR RATTATA: ', sprite['id'])
    } else {
      scope.$emit('gameEvent', {type: sprite['markerType'], id: sprite['id']})
    }
  }

  // takes a height and width in number of clouds and an array of objects of xy percentages representing where to hide clouds,
  // returns a matrix of 1 (cloud) 0 no clouds
  function mapToGrid (pointsArr) {
    let hFact = 200
    let wFact = 200
    for (var i = 150; i <= scope.width; i++) {
      if (!scope.height % i) hFact = i
      if (!scope.width % i) wFact = i
    }
    let shift = 0.0
    let width = Math.floor(scope.width / wFact)
    let height = Math.floor(scope.height / hFact)

    console.log('Clouds h: ' + height + ' w: ' + width)

    let matrix = Array.from(Array(height + 1), (a, i) => Array.from(Array(width + 1), (b, j) => {
      return {
        cloud: true,
        x: scope.width * (j / width),
        y: scope.height * (i / height)
      }
    }))

    console.log('Here!')
    console.log(matrix)

    if (pointsArr) {
      pointsArr.forEach((elem, index) => {
        let xGrid = Math.floor(width * (elem.x + shift))
        let yGrid = Math.floor(height * (elem.y + shift))
        console.log('X: ' + xGrid, 'Y: ' + yGrid)
        matrix[yGrid][xGrid].cloud = false
      })
    }

    return matrix
  }

  // Create an individual cloud.
  function createACloud (x, y, width, height) {
    let tempSprite = new Phaser.Sprite(gameAR, x, y, 'cloud')
    graphicsLayer.add(tempSprite)
    tempSprite.scale.setTo(width, height)
    cloudArray.push(tempSprite)
  }

  // Create a cloud grid.
  function createACloudGrid (aMatrix) {
    console.log('CREATING CLOUDS')
    aMatrix.forEach(function (aRow) {
      aRow.forEach(function (aCloud) {
        if (aCloud.cloud) {
          createACloud(aCloud.x - 200, aCloud.y - 300, 1, 1.3)
        }
      })
    })
    if (firstBroadcast) {
      firstBroadcast = false
      ModalFactory.closeModal()
    }
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

  scope.$on('updateAR', (event, data) => {
    clearMarkers()
    deleteClouds()
    createACloudGrid(mapToGrid(data.visited))
    addMarkers(data.locations)
  })
}

// Part of a state that has an ARController as a parent - so broadcasts are available.
// custom directive to link phaser object to angular
app.directive('arCanvas', function ($injector, $window, $interval, ModalFactory) {
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
      scope.width = $window.innerWidth
      scope.height = $window.innerHeight
      if (scope.data) {
        window.createGameAR(ele, scope, scope.players, scope.mapId, $injector, $interval, ModalFactory)
      }
    }
  }
})
