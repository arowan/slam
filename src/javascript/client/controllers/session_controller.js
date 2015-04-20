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
