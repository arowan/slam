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

function sessionController($scope, sessionService, $routeSegment) {
  $scope.user = {
    username: null,
    password: null
  };

  $scope.segment = $routeSegment.chain[0];

  var reload = function () {
    $scope.segment.reload();
  };

  var setError = function (data) {
    $scope.error = data.error;
  };

  var resetError = function () {
    $scope.error = null;
  };

  $scope.login = function () {
    resetError();
    sessionService.login($scope.user, reload, setError);
  };

  $scope.register = function () {
    resetError();
    sessionService.register($scope.user, reload, setError);
  };

}

sessionController.$inject = ['$scope', 'sessionService', '$routeSegment'];
angular.module('slamApp').controller('sessionController', sessionController);

function userController($scope, user, sessionService, $routeSegment) {
  $scope.currentUser = user;
  console.log(user);
  $scope.segment = $routeSegment.chain[0];

  function reload () {
    $scope.segment.reload();
  }

  $scope.logout = function () {
    sessionService.logout(reload);
  };
}

userController.$inject = ['$scope', 'user', 'sessionService', '$routeSegment'];
angular.module('slamApp').controller('userController', userController);

angular.module('slamFactories', []);
angular.module('slamServices', []);
angular.module('slamFilters', []);
angular.module('slamDirectives', []);

function sessionService ($http, $cookies, $q) {

  var object = {
    currentUser: null
  };

  var setCookie = function (session) {
    $cookies._slam_session = session;
  };

  var postRequest = function (url, data, success, error) {
    var promise = $http.post(url, data);
    promise.then(function (response) {
      var user = response.data;
      setCookie(user._session);
      if (success) success(user);
    }, function (response) {
      var e = response.data;
      if (error) error(e);
    });
  };

  object.setCurrentUser = function (user) {
    object.currentUser = user;
  };

  object.current = function () {
    return $q(function (resolve, reject) {
      $http.get('/api/users/current').then(function (response) {
        var user = response.data;
        object.setCurrentUser(user);
        resolve(object.currentUser);
      },function (response) {
        reject(response);
      });
    });
  };

  object.login = function (data, success, error) {
    postRequest('/api/users/login', data, success, error);
  };

  object.logout = function (success, error) {
    var promise = $http.delete('/api/users/current');
    promise.then(function (response) {
      setCookie(null);
      if (success) success();
    }, function (response) {
      var e = response.data;
      if (error) error(e);
    });
  };

  object.register = function (data, success, error) {
    postRequest('/api/users/register', data, success, error);
  };

  return object;

}

sessionService.$inject = ['$http', '$cookies', '$q'];
angular.module('slamServices').service('sessionService', sessionService);
