app.directive('createBunkerPrompt', function ($rootScope, AuthService, AUTH_EVENTS, $state) {
  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/bunkerprompt/bunker-prompt.html'
  }
})
// Glitch where if you exit in middle of prompt - were not bringing you back!
