app.directive('stats', function (CharOverFactory) {
  return {
    retrict: 'E',
    templateUrl: 'js/common/directives/character-overview/stats.html',
    scope: {
      stat: '='
    },
    link: function (scope) {}
  }
})
