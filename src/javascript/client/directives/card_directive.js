function card () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      face: '@'
    },
    templateUrl: '/templates/components/card_template.html',
    link: function (scope, element) {
      scope.onMove = function (data) {
        console.log(data);
      };
    }
  };
}

angular.module('slamDirectives').directive('card', card);
