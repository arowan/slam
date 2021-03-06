function $sessionService ($http, $cookies, $q) {

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
    this.currentUser = user;
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

$sessionService.$inject = ['$http', '$cookies', '$q'];
angular.module('slamServices').service('$sessionService', $sessionService);
