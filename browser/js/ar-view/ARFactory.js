app.factory('ARFactory', function ($http) {
  let ARFactory = {}
  let showMenu = false

  ARFactory.showMenu = () => {
    showMenu = !showMenu
  }

  ARFactory.getMenuView = () => showMenu

  return ARFactory
})
