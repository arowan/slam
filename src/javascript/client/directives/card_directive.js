function card () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      face: '@'
    },
    template: "<object data='/cards/{{face}}.svg' type='image/svg+xml'></object>"
  };
}

angular.module('slamDirectives').directive('card', card);
