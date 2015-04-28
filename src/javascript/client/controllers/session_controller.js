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
