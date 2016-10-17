app.controller('GameController', function ($scope, $rootScope, ModalFactory, $localStorage, showGame, GameViewFactory, MenuFactory, bunkerState, FbFactory, Socket, EventFactory) {
  // display game upon transition to game view
  $scope.showGame = showGame

  $scope.bunkerState = bunkerState

  // toggle value for showing in-game menu + game pause && vice-versa
  $scope.showMenu = () => {
    let retVal = GameViewFactory.getMenuView()
    if (!retVal) {
      $scope.$broadcast('resume')
    } else {
      $scope.$broadcast('pause')
    }
    return retVal
  }

  // toggles bunker menu
  $scope.menuVisible = () => {
    GameViewFactory.showMenu()
  }

  // add floors from in-game menu
  $scope.addFloor = () => {
    MenuFactory.addFloor()
    MenuFactory.toggleBunkerSave()
  }

  // TODO: not being used right now!
  $scope.totalFloors = () => MenuFactory.getFloors()

  // save bunker state from in-game menu
  $scope.saveBunker = () => {
    MenuFactory.toggleBunkerSave()
  }

  // useful for testing save/load
  $scope.clearBunker = () => {
    $scope.$broadcast('clearing')
  }

  // <---- LISTENERS FOR BUNKER VIEW EVENTS ---->

  // <---- DEPOSITING RESOURCES FROM BACKPACK TO BUNKER ---->
  $scope.$on('saveResource_Phaser', function (event, data) {
    // ModalFactory.changeModal('message', {
    //   newContent: {
    //     title: 'Deposit Resources',
    //     description: 'Would you like to deposit your resources in your bunkers cache for use in upgrading your equipment?',
    //     eventType: 'yes/no',
    //     source: '/pimages/message.png',
    //     type: 'general',
    //     id: 998,
    //     status: 'neutral',
    //     exitType: 'load',
    //     next: 'New Storage'
    //   },
    //   forceOpen: true
    // })
    // EventFactory.getBackpack()
    //   .then(backpack => {
    //     console.log('USER BACKPACK: ', backpack)
    //     return EventFactory.depositResources(backpack)
    //   })
    // TODO: in case we need event generator!
    $rootScope.socket.emit('saveResources_Client')
  })

  // <---- BRING UP UPGRADE MENU ----->
  $scope.$on('startUpgrade_Phaser', function (event, data) {
    console.log('GOT START UPGRADE FROM PHASER~~')
    $rootScope.socket.emit('purchaseUpgrades')
  })

  // removes erroneous 'second' game view on page refresh
  $scope.$on('$destroy', () => {
    $scope.showGame = !$scope.showGame
  })
})
