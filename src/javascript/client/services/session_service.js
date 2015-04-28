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
