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
