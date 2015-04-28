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

function sessionController($scope, sessionService) {
  $scope.user = {
    username: null,
    password: null
  };


  $scope.login = function () {
    sessionService.login($scope.user);
  };

  $scope.register = function () {
   sessionService.register($scope.user);
  };

}

sessionController.$inject = ['$scope', 'sessionService'];
angular.module('slamApp').controller('sessionController', sessionController);

function userController($scope, user, sessionService) {
  sessionService.setCurrentUser(user);

  $scope.logout = function () {
    sessionService.logout();
  };
}

userController.$inject = ['$scope', 'user', 'sessionService'];
angular.module('slamApp').controller('userController', userController);

angular.module('slamFactories', []);
angular.module('slamServices', []);
angular.module('slamFilters', []);
angular.module('slamDirectives', []);

function sessionService ($http, $cookies) {

  var object = {
    currentUser: null
  };

  function setCookie (session) {
    $cookies._slam_session = session;
  }

  function postRequest (url, data, success, error) {
    var promise = $http.post(url, data);
    promise.then(function (response) {
      var user = response.data;
      setCookie(user._session);
      object.setCurrentUser(user);
      if (success) success(user);
    }, function (error) {
      console.log(error);
      error();
    });
  }

  object.setCurrentUser = function (user) {
    object.currentUser = user;
  };

  object.login = function (data, success, error) {
    postRequest('/api/users/login', data, success, error);
  };

  object.logout = function (success, error) {
    var promise = $http.delete('/api/users/current');
    promise.then(function (response) {
      setCookie(null);
      object.setCurrentUser(null);
      if (success) success();
    }, function (error) {
      console.log(error);
      error();
    });
  };

  object.register = function () {
    postRequest('/api/users/register', data, success, error);
  };

  return object;

}

sessionService.$inject = ['$http', '$cookies'];
angular.module('slamServices').service('sessionService', sessionService);
