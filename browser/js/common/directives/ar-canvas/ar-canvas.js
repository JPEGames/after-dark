window.createGameAR = function (ele, scope, players, mapId, injector) {
  console.log('AR GETTING CALLED!')
  // let height = parseInt(ele.css('height'), 10)
  // let width = parseInt(ele.css('width'), 10)

  var gameAR = new Phaser.Game(960, 600, Phaser.CANVAS, 'ar-canvas', { preload: preload, create: create, update: update, render: render }, true)

  scope.$on('$destroy', () => {
    gameAR.destroy()
  })

  var emitter
  var cloudArray = []

  function preload () {
    gameAR.load.image('cloud', '/pimages/cloud2.png')
  }

  function create () {
    gameAR.physics.startSystem(Phaser.Physics.ARCADE)
    let cloudNum = 20
    for (let i = 0; i < cloudNum; i++) {
      let x = (gameAR.world.width / 5) + (gameAR.world.width - (Math.random() * 100) - 300) * Math.cos(2 * Math.PI * i / cloudNum)
      let y = (gameAR.world.height / 10) - (gameAR.world.height - (Math.random() * 100) - 175) * Math.sin(2 * Math.PI * i / cloudNum)
      createACloud(x, y)
    }
  }

  function update () {
  }

  function render () {
  }

  function createACloud (x, y) {
    cloudArray.push(gameAR.add.sprite(x, y, 'cloud'))
  }

  function deleteClouds () {
    cloudArray.forEach(function (cloud) {
      cloud.destroy()
    })
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
      if (scope.data) {
        window.createGameAR(ele, scope, scope.players, scope.mapId, $injector)
      }
    }
  }
})
