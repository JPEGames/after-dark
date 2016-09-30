app.config(function ($stateProvider) {
  $stateProvider.state('master.navbar.home', {
    url: '/',
    templateUrl: 'js/home/home.html',
    controller: 'HomeController'
  })
})
