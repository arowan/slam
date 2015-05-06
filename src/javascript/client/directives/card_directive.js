function card () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      face: '@'
    },
    templateUrl: 'templates/card_template.html'
  };
}

angular.module('slamDirectives').directive('card', card);
