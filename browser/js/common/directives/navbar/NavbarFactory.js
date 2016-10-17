app.factory('NavbarFactory', function ($http, $interval) {
  let NavbarFactory = {}
  let hasCharacter = null
  let hasBunker = null

  NavbarFactory.getter = () => {
    return {hasCharacter: hasCharacter, hasBunker: hasBunker}
  }
  NavbarFactory.setter = (characterState, bunkerState) => {
    hasCharacter = characterState
    hasBunker = bunkerState
  }
  NavbarFactory.createExp = function (expAmount) {
    var posx = window.mouseXY.x
    var posy = window.mouseXY.y

    console.log('X: ' + posx)
    console.log('Y: ' + posy)

    if (document.getElementById('textFloat')) {
      document.getElementById('textFloat').remove()
    }

    var newDiv = document.createElement('div')
    newDiv.setAttribute('id', 'textFloat')
    document.body.appendChild(newDiv)

    newDiv.innerHTML = '+' + expAmount + ' Exp'
    newDiv.style = `z-index: 100011; top: ` + posy + `px; left: ` + (posx - 35) + `px; display: block; position: absolute; transition: top 3s, opacity 3s; color: #66bb6a; font-size: 2em;`

    console.log(newDiv)

    let moveUp = function () {
      newDiv.style.top = posy - 100 + 'px'; newDiv.style.opacity = 0
    }

    $interval(moveUp, 100, 1)

    console.log('Called createExp!')
  }
  return NavbarFactory
})
