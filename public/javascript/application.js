angular.module('slamApp', [
  'ngRoute', 
  'route-segment', 
  'view-segment'
  ])
  .config(['$routeSegmentProvider', function ($routeSegmentProvider) {
    
    $routeSegmentProvider.options.autoLoadTemplates = true;
    $routeSegmentProvider
      .when('/', 'root')

      .segment('root', {
        templateUrl: 'templates/root.html',
        controller: rootController
      });


  }]);

function rootController($scope) {

}

rootController.$inject = ['$scope'];
angular.module('slamApp').controller('rootController', rootController);

angular.module('slamFactories', []);
angular.module('slamServices', []);
angular.module('slamFilters', []);
angular.module('slamDirectives', []);
