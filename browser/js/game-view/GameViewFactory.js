// for retrieving game state

app.factory('GameViewFactory', function ($http) {
  let GameViewFactory = {}
  let gameState = null
  let showMenu = false

  // gets game state object from db upon user login
  GameViewFactory.getUserState = () => {
    if (!gameState) {
      return $http.get('/api/gamestate')
        .then(res => {
          gameState = res.data
          return res.data
        })
    } else {
      return gameState
    }
  }

  // on logout, reset gameState
  GameViewFactory.clearUserState = () => {
    gameState = null
  }

  // displaying/hiding in-game menu
  GameViewFactory.showMenu = () => {
    showMenu = !showMenu
  }

  // return boolean to show/hide in-game menu - used in GameController
  GameViewFactory.getMenuView = () => showMenu

  return GameViewFactory
})
