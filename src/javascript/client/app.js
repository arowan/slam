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
      .when('/', 'user')

      .segment('user', {
        templateUrl: 'templates/user.html',
        controller: userController,
        resolve: {
          user: ['sessionService', function (sessionService) {
            return sessionService.current();
          }]
        },
        resolveFailed: {
          templateUrl: 'templates/session.html',
          controller: sessionController
        }
      });


  }]);
