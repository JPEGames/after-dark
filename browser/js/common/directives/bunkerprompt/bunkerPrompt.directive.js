app.directive('createBunkerPrompt', function ($rootScope, AuthService, AUTH_EVENTS, $state) {
  return {
    restrict: 'E',
    template: `<h5>You do not have a Bunker Do you wish to create one?</h5>
    <p>Your current location will be used as your bunker's location. You cannot move this later. Proceed?</p>
    <button ng-click="logout()">no</button> <button ng-click="createBunker()">yes</button>
    `
  }
})
