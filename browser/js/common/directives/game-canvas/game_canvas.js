// testing for phaser

window.createGame = function (ele, scope, players, mapId, injector, MenuFactory) {
  console.log('GETTING CALLED!')
  // let height = parseInt(ele.css('height'), 10)
  // let width = parseInt(ele.css('width'), 10)

  var game = new Phaser.Game(960, 600, Phaser.CANVAS, 'game-canvas', { preload: preload, create: create, update: update, render: render })
  // The walk through: Make new pseudo-iframe object. The world and camera have a width, height of 960, 600
  // My parent div is phaser-example
  // My preload function is titled preload, create: create, update: update, and render: render

  // adds floors upon press of add floor option in game menu
  scope.$watch(MenuFactory.getFloors, (floorVal) => {
    if (floorVal > 0) {
      tryBuild()
    }
  })

  scope.$on('pause', pauseGame)
  scope.$on('resume', resumeGame)

  // TODO: destroys game instance on refresh...is this what we want??!?
  scope.$on('$destroy', () => {
    game.destroy()
  })

  function preload () {
    game.stage.backgroundColor = '#76bcbb'
    // game.load.image('mushroom', 'pimages/star.png')
    game.load.tilemap('map', 'pmaps/bunkerv1.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.image('tiles', 'pmaps/tmw_desert_spacing.png')
    game.load.image('tiles2', 'pmaps/sewer_tileset.png')
    game.load.image('tiles3', 'pmaps/scifi1.png')
    game.load.spritesheet('player', 'pimages/dude.png', 32, 48)
  }
  // Set bg color behind all elements in this frame
  // Load my tilemap - a json that can be found in assets - that is essentially a matrix of png elements
  // load the sheets of png's that this map uses
  // Now load the 'spritesheet' the image that is the character - it has nine frames - 4 right, 4 left, 1 standing still

  var cursors
  var o_camera
  var cameraDrag = 5
  var cameraAccel = 3
  var camVelX = 0
  var camVelY = 0
  var camMaxSpeed = 80
  var map
  var layer, layer2, layer3, layer4, layer5
  var tile
  var log
  // var tileUp = false
  var player
  var marker
  var leftKey, rightKey, upKey, downKey, useKey, pauseKey
  var useTimer = 0
  var totalFloor = 3
  var currentFloors = 1
  var builtFloor = false
  // var totalLayers = 4
  var doorSwitch = true
  var testSave
  // declare semi globals - figure it out

  function create () {
    game.physics.startSystem(Phaser.Physics.ARCADE)
    // Multiple systems of physics, this is the simplest.

    map = game.add.tilemap('map')
    map.addTilesetImage('bunkerv2', 'tiles')
    map.addTilesetImage('sewer_tileset', 'tiles2')
    map.addTilesetImage('scifi1', 'tiles3')
    layer3 = map.createLayer('Bounds')
    layer = map.createLayer('Ground')
    layer2 = map.createLayer('Bunker')
    layer4 = map.createLayer('Interactive')
    layer5 = map.createLayer('Upgrades')
    // Add all the elements we preloaded.
    // The tilemap has layers - the bunker, its bg, and what the player collides with - check out Tiled
    game.world.setBounds(0, 0, 960, 3040)
    game.world.resize(960, 3040)
    // Sets the physics bounds of the world - startx, starty, maxx, maxy

    marker = game.add.graphics()
    marker.lineStyle(2, 0xffffff, 1)
    marker.drawRect(0, 0, 32, 32)
    // Create the things that allow us to select tiles

    game.input.addMoveCallback(updateMarker, this)
    // What happens when i move the mouse? Add a listener and bind this

    map.setCollision(55, true, layer3)

    // Door Collisions
    map.setTileIndexCallback(64, moveDown, this, layer4)
    map.setTileIndexCallback(65, moveUp, this, layer4)

    // Upgrade Collisions
    map.setTileIndexCallback(93, compOne, this, layer5)
    map.setTileIndexCallback(94, compTwo, this, layer5)
    map.setTileIndexCallback(95, compThree, this, layer5)

    // OKAY understandably confusing if you are not familiar with game design.
    // The engine is running a collision engine. The TLDR is that velocity is set to 0 upon interaction with above.
    // 55 is the EXACT tile this applies to.
    // TRUE is STOP MOVING - FALSE is RECORD COLLISION BUT DO NOT STOP MOVING - IT ONLY APPLIES TO THE COLLISION LAYER
    // the last two lines, implement staircase functionality.

    /*
     for (var i = 0; i < 100; i++)
     {
     game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom')
     }
     //Bullshit

     game.add.text(300, 300, "- Bunker Test -", { font: "32px Arial", fill: "#330088", align: "center" })
     game.add.text(300, 350, "Up Arrow, Down Arrow", { font: "32px Arial", fill: "#330088", align: "center" })
     game.add.text(300, 400, "Mouse Drag/Touch", { font: "32px Arial", fill: "#330088", align: "center" })
     //Early testing stuff
     */
    var g = game.add.group()
    g.x = 500
    // Disregard - may be used later.

    cursors = game.input.keyboard.createCursorKeys()
    // Create input keys - aka ASCII abstraction - removes their ability to be used by DOM
    game.inputEnabled = true

    // TODO: PUT ANY FUNCTION HERE - will activate on any click of wall
    game.input.onDown.add(getTileProperties, this)
    // OKAY - input enabled is 1/2 things for touch enabled. May not work yet.
    // game.input = mouse
    // onDown = event
    // add = addListener function
    // logTile - the listener function
    // bind this

    player = game.add.sprite(32, 280, 'player')
    // Add the player spritesheet - it has 32, 32 dimensions

    game.physics.enable(player)
    // Physics apply to this element

    game.physics.arcade.gravity.y = 250
    // This is how intensely y grid physics apply

    player.body.linearDamping = 1
    // Damp the effects of physics misc functions 100%
    player.body.collideWorldBounds = true
    // I cannot escape world boundaries
    player.body.checkCollision.right = true
    // I follow the rules of walls to the right
    player.body.checkCollision.left = true
    // I follow the rules of walls to the left

    player.animations.add('left', [0, 1, 2, 3], 10, true)
    player.animations.add('right', [5, 6, 7, 8], 10, true)
    // Name animation, what frames is this animation, at what FPS, do I idle otherwise?

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.W)
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.S)
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A)
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D)
    useKey = game.input.keyboard.addKey(Phaser.Keyboard.E)
    pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P)

  // Alias keys - didnt work otherwise, dont ask.
  }

  function update () {
    if (useTimer < 180) {
      useTimer++
    }

    game.physics.arcade.collide(player, layer3)
    game.physics.arcade.collide(player, layer4)
    game.physics.arcade.collide(player, layer5)

    player.body.velocity.x = 0
    // Every 1/60 frame, reset x velocity

    if (pauseKey.isDown) {
      if (game.paused === false) {
        pauseGame()
      }
    }

    if (player.body.y > 2900) {
      loadBunker(testSave)
      player.body.y = 280
    }

    if (leftKey.isDown) {
      //  Move to the left
      player.body.velocity.x = -300
      // by this much

      player.animations.play('left')
    // animate this
    } else {
      if (rightKey.isDown) {
        //  Move to the right
        player.body.velocity.x = 300
        // by this much

        player.animations.play('right')
      // animate this
      } else {
        player.animations.stop()
        // otherwise, standstill

        player.frame = 4
      // at this frame
      }
    }
    if (upKey.isDown) {
      // Move world up
      game.camera.y -= 4
    // by this much
    } else {
      if (downKey.isDown) {
        // move world down
        game.camera.y += 4
      // by this much
      }
    }
    drag_camera(game.input.mousePointer)
    drag_camera(game.input.pointer1)
    update_camera()
  // Monitor mouse/touch world movement
  }

  function render () {
    game.debug.cameraInfo(game.camera, 32, 32)
    // Show camera info
    game.debug.text('Tile Info: ' + log, 32, 570)
  // Show selected tile
  }

  function tryBuild (aFloor) {
    if (!builtFloor) {
      buildAFloor(basicFloor)
    }
  }
  // Move player down.
  function moveDown () {
    console.log('Attempting to teleport down!')
    if (player.body.x > (game.world.width / 2)) {
      player.body.x = player.body.x - 32
    } else {
      player.body.x = player.body.x + 32
    }
    player.body.y = player.body.y + (32 * 7)
    if (player.body.y > (game.camera.y + game.camera.height - 96)) {
      game.camera.y = player.body.y - game.camera.height / 2
    }
  }

  // Move player up.
  function moveUp () {
    console.log('Attempting to teleport!')
    if (player.body.x > (game.world.width / 2)) {
      player.body.x = player.body.x - 32
    } else {
      player.body.x = player.body.x + 32
    }
    player.body.y = player.body.y - (32 * 7)
    if (player.body.y < (game.camera.y + 96)) {
      game.camera.y = player.body.y - game.camera.height / 2
    }
  }

  function pauseGame () {
    game.paused = true
  }

  function resumeGame () {
    game.paused = false
  }

  // Saves entire maps state.
  function saveBunker () {
    // The object we will be sending to DB.
    let saveObj = {
      bg: [],
      visual: [],
      collision: [],
      interactive: [],
      upgrades: []
    }
    // For height of map after sky.
    for (let curY = 4; curY < 95; curY++) {
      let bgCurRow = []
      let vCurRow = []
      let cCurRow = []
      let iCurRow = []
      let uCurRow = []
      for (let curX = 0; curX < 30; curX++) {
        let bgTile = map.getTile(curX, curY, layer)
        let vTile = map.getTile(curX, curY, layer2)
        let cTile = map.getTile(curX, curY, layer3)
        let iTile = map.getTile(curX, curY, layer4)
        let uTile = map.getTile(curX, curY, layer5)

        if (bgTile !== null) {
          bgCurRow.push(bgTile.index)
        } else {
          bgCurRow.push(0)
        }

        if (vTile !== null) {
          vCurRow.push(vTile.index)
          console.log('V Tile Saved.')
        } else {
          vCurRow.push(0)
        }

        if (cTile !== null) {
          cCurRow.push(cTile.index)
          console.log('!!! C Tile Saved.')
        } else {
          cCurRow.push(0)
        }

        if (iTile !== null) {
          iCurRow.push(iTile.index)
          console.log('!!! I Tile Saved.')
        } else {
          iCurRow.push(0)
        }
        if (uTile !== null) {
          uCurRow.push(bgTile.index)
          console.log('!!! U Tile Saved.')
        } else {
          uCurRow.push(0)
        }
      }
      saveObj.bg.push(bgCurRow)
      saveObj.visual.push(vCurRow)
      saveObj.collision.push(cCurRow)
      saveObj.interactive.push(iCurRow)
      saveObj.upgrades.push(uCurRow)
    }
    console.log(saveObj)
    return saveObj
  }

  // Delete all tiles.
  function clearBunker () {
    testSave = saveBunker()
    for (let curY = 4; curY < 95; curY++) {
      for (let curX = 0; curX < 30; curX++) {
        if (map.getTile(curX, curY, layer) !== null) {
          map.removeTile(curX, curY, layer).destroy()
        }
        if (map.getTile(curX, curY, layer2) !== null) {
          map.removeTile(curX, curY, layer2).destroy()
        }
        if (map.getTile(curX, curY, layer3) !== null) {
          map.removeTile(curX, curY, layer3).destroy()
        }
        if (map.getTile(curX, curY, layer4) !== null) {
          map.removeTile(curX, curY, layer4).destroy()
        }
        if (map.getTile(curX, curY, layer5) !== null) {
          map.removeTile(curX, curY, layer5).destroy()
        }
      }
    }
    console.log('Cleared Bunker!')
  }

  function loadBunker (saveData) {
    for (let curY = 4; curY < 95; curY++) {
      for (let curX = 0; curX < 30; curX++) {
        let actY = curY - 4

        if (saveData.bg[actY][curX] !== 0) {
          map.putTile(saveData.bg[actY][curX], curX, curY, layer)
        }

        if (saveData.collision[actY][curX] !== 0) {
          map.putTile(saveData.collision[actY][curX], curX, curY, layer3)
        }

        if (saveData.visual[actY][curX] !== 0) {
          map.putTile(saveData.visual[actY][curX], curX, curY, layer2)
        }

        if (saveData.interactive[actY][curX] !== 0) {
          map.putTile(saveData.interactive[actY][curX], curX, curY, layer4)
        }
        if (saveData.upgrades[actY][curX] !== 0) {
          map.putTile(saveData.upgrades[actY][curX], curX, curY, layer5)
        }
      }
    }
    console.log('Loaded Bunker!')
  }

  const basicFloor = {
    visual: [
      // Y GRID
      [33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35], // 1
      [33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35], // 2
      [33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35], // 3
      [33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35], // 4
      [33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35], // 5
      [33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35], // 6
      [9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11], // 7
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // 8
    ],
    collision: [
      // Y GRID
      [55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 55], // 1
      [55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 55], // 2
      [55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 55], // 3
      [55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 55], // 4
      [55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 55], // 5
      [55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 55], // 6
      [55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 55], // 7
      [55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55] // 8
    ],
    interactive: [
      // Y GRID
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 3
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 4
      [0, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 0], // 5
      [0, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 0], // 6
      [0, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 0], // 7
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // 8
    ],
    upgrades: [
      // Y GRID
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 3
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 4
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 5
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 6
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 7
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // 8
    ]
  }

  // NEEDS TO ADD A DOOR DOWN ON THE FLOOR ABOVE
  // Dynamically add a floor, takes an Object w/ { visual: [[],[]], collision: [[],[]], interactive: [[],[]], upgrades: [[],[]]} | [[],[]] = a matrix of tile indexes.
  function buildAFloor (objectOfMatrices) {
    builtFloor = true
    console.log('Attempting to build floor #' + (currentFloors + 1))
    if (currentFloors < totalFloor) {
      builtFloor = false
      let startY = 12 + (currentFloors - 1) * 7
      // Lets go right, down.
      // Keep in mind map location and matrix location are parallel but have different y coords due to displacement.
      for (let curX = 1; curX <= 30; curX++) {
        // console.log('Working on column ' + curX)
        for (let curY = startY; curY < startY + 8; curY++) {
          // console.log('Working on row ' + curY)
          // Fix Y for displacement on handed in floor object
          let actY = curY - startY
          let actX = curX - 1
          // VISUAL
          // If this isn't a non - tile in the object...
          if (objectOfMatrices.visual[actY][actX] !== 0) {
            // Add a tile to this (non-displaced) location, and on proper layer.
            map.putTile(objectOfMatrices.visual[actY][actX], actX, curY - 1, layer2)
          // console.log('Placing a visual tile @ ' + curX + ',' + curY)
          }
          // COLLISION
          if (objectOfMatrices.collision[actY][actX] !== 0) {
            // Add a tile to this (non-displaced) location, and on proper layer.
            map.putTile(objectOfMatrices.collision[actY][actX], actX, curY - 1, layer3)
          // console.log('Placing a collision tile @ ' + curX + ',' + curY)
          }
          // INTERACTIVE
          if (objectOfMatrices.interactive[actY][actX] !== 0) {
            // Add a tile to this (non-displaced) location, and on proper layer.
            if (objectOfMatrices.interactive[actY][actX] !== -1) {
              map.putTile(objectOfMatrices.interactive[actY][actX], actX, curY - 1, layer4)
              console.log('Placing an interactive tile @ ' + curX + ',' + curY + ' ! ' + objectOfMatrices.interactive[actY][actX])
            } else {
              // In door creation.
              if (doorSwitch) {
                if (actX >= 15) {
                  map.putTile(65, actX, curY - 1, layer4)
                  map.putTile(64, actX, curY - 8, layer4)
                }
              } else {
                if (actX < 15) {
                  map.putTile(65, actX, curY - 1, layer4)
                  map.putTile(64, actX, curY - 8, layer4)
                }
              }
            }
          }
          // UPGRADES
          if (objectOfMatrices.upgrades[actY][curX] !== 0) {
            // Add a tile to this (non-displaced) location, and on proper layer.
            map.putTile(objectOfMatrices.upgrades[actY][actX], curX, curY, layer5)
          }
        }
      }
      currentFloors = currentFloors + 1
      doorSwitch = !doorSwitch
      console.log('Completed floor build.')
    } else {
      console.log('Reached Max Floor Capacity.')
    }
  }

  function drag_camera (o_pointer) {
    if (!o_pointer.timeDown) {
      // If click isnt longer than a click
      return
    }
    if (o_pointer.isDown && !o_pointer.targetObject) {
      // If ive stayed down, and this isnt one of my target objects ala exception cases
      if (o_camera) {
        camVelX = (o_camera.x - o_pointer.position.x) * cameraAccel
        camVelY = (o_camera.y - o_pointer.position.y) * cameraAccel
      // Figure out diff - multiply by accel
      }
      o_camera = o_pointer.position.clone()
    // else were the same mofucka
    }

    if (o_pointer.isUp) {
      o_camera = null
    }
  // If nothings going on, no deal
  }

  function getTileProperties () {
    var x = layer5.getTileX(game.input.activePointer.worldX)
    var y = layer5.getTileY(game.input.activePointer.worldY)
    // find the tile location based on mouse location (diff x, y vals)

    tile = map.getTile(x, y, layer5)
    // Grab tile objects based on these
    console.log(tile)
    log = tile.index
    // Set semi-glob to this
    console.log({x: x, y: y, index: tile.index})
    // Return object with pertinent data
    return {x: x, y: y, index: tile.index}
  }

  // Not worth getting too into - essentially the physics of moving camera via mouse.
  // Mix of old games ive made and online stuff. Live with other peoples work. it works.
  // May need some work for touch enabled.
  function update_camera () {
    camVelX = clamp(camVelX, camMaxSpeed, -camMaxSpeed)
    camVelY = clamp(camVelY, camMaxSpeed, -camMaxSpeed)

    game.camera.x += camVelX
    game.camera.y += camVelY

    // Set Camera Velocity X Drag
    if (camVelX > cameraDrag) {
      camVelX -= cameraDrag
    } else if (camVelX < -cameraDrag) {
      camVelX += cameraDrag
    } else {
      camVelX = 0
    }

    // Set Camera Velocity Y Drag
    if (camVelY > cameraDrag) {
      camVelY -= cameraDrag
    } else if (camVelY < -cameraDrag) {
      camVelY += cameraDrag
    } else {
      camVelY = 0
    }
  }

  function updateMarker () {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32
  }

  function clamp (val, max, min) {
    var value = val

    if (value > max) value = max
    else if (value < min) value = min

    return value
  }

  function compOne () {
    if (useKey.isDown && useTimer > 30) {
      useTimer = 0
      console.log('Computer One Activated.')
    }
  }

  function compTwo () {
    if (useKey.isDown && useTimer > 30) {
      useTimer = 0
      console.log('Computer Two Activited')
    }
  }

  function compThree () {
    if (useKey.isDown && useTimer > 30) {
      useTimer = 0
      console.log('Computer Three Activated')
    }
  }
}

// custom directive to link phaser object to angular
app.directive('gameCanvas', function ($injector, MenuFactory) {
  return {
    scope: {
      data: '=',
      mapId: '='
    },
    template: '<div id="game-canvas"></div>',
    link: function (scope, ele, attrs) {
      // condition for state transition into game view
      if (scope.data) {
        window.createGame(ele, scope, scope.players, scope.mapId, $injector, MenuFactory)
      }
    }
  }
})
