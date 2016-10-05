app.config(function ($stateProvider) {
  $stateProvider.state('master', {
    template: `
      <div id="main" class="row" ui-view>
       </div>
    `,
    controller: function ($scope, $state) {
      $state.go('master.navbar.home')
    }
  })
})
