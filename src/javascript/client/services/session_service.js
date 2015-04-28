function sessionService ($http, $cookies, $q) {

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
      if (success) success(user);
    }, function (error) {
      console.log(error);
      error();
    });
  }

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
    }, function (error) {
      console.log(error);
      error();
    });
  };

  object.register = function (data, success, error) {
    postRequest('/api/users/register', data, success, error);
  };

  return object;

}

sessionService.$inject = ['$http', '$cookies', '$q'];
angular.module('slamServices').service('sessionService', sessionService);
