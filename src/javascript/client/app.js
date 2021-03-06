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
      .when('/', 'user.board')
      .when('/lobby', 'user.lobby')
      .when('/match/:id', 'user.match')

      .segment('user', {
        templateUrl: 'templates/user.html',
        controller: userController,
        resolve: {
          user: ['$sessionService', function ($sessionService) {
            return $sessionService.current();
          }]
        },
        resolveFailed: {
          templateUrl: 'templates/session.html',
          controller: sessionController
        }
      })

      .within()
        .segment('board', {
          controller: boardController,
          templateUrl: 'templates/board.html'
        })

        .segment('match', {
          controller: matchController,
          templateUrl: 'templates/match/index.html',
          untilResolved: {
            templateUrl: 'templates/match/joining.html'
          },
          resolve: {
            user: ['$sessionService', function ($sessionService) {
              return $sessionService.current();
            }]
          },
          resolveFailed: {
            templateUrl: 'templates/match/login.html'
          }
        })

        .segment('lobby', {
          controller: lobbyController,
          templateUrl: 'templates/lobby.html'
        })

        .up()
      .up();


  }]);
