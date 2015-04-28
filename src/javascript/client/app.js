angular.module('slamApp', [
  'ngRoute', 
  'ngCookies',
  'route-segment', 
  'view-segment',
  'slamFactories', 
  'slamServices',
  'slamFilters',
  'slamDirectives'
  ])
  .config(['$routeSegmentProvider', function ($routeSegmentProvider) {
    
    $routeSegmentProvider.options.autoLoadTemplates = true;
    $routeSegmentProvider
      .when('/', 'session')

      .segment('session', {
        templateUrl: 'templates/user.html',
        controller: userController,
        resolve: {
          user: ['$http', function ($http) {
            return $http.get('/api/users/current');
          }]
        },
        resolveFailed: {
          templateUrl: 'templates/session.html',
          controller: sessionController
        }
      });


  }]);
