angular.module('slamApp', [
  'ngRoute', 
  'route-segment', 
  'view-segment'
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

function sessionController($scope, $http) {
  $scope.user = {
    username: null,
    password: null
  };

  $scope.login = function () {
    var promise = $http.post('/api/users/login', $scope.user);
    
  };

  $scope.register = function () {

  };


}

sessionController.$inject = ['$scope', '$http'];
angular.module('slamApp').controller('sessionController', sessionController);

function userController($scope, user) {
  
}

userController.$inject = ['$scope', 'user'];
angular.module('slamApp').controller('userController', userController);

angular.module('slamFactories', []);
angular.module('slamServices', []);
angular.module('slamFilters', []);
angular.module('slamDirectives', []);
