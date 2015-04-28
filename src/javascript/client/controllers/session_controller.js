function sessionController($scope, sessionService, $routeSegment) {
  $scope.user = {
    username: null,
    password: null
  };

  $scope.segment = $routeSegment.chain[0];

  function reload () {
    $scope.segment.reload();
  }

  $scope.login = function () {
    sessionService.login($scope.user, reload);
  };

  $scope.register = function () {
   sessionService.register($scope.user, reload);
  };

}

sessionController.$inject = ['$scope', 'sessionService', '$routeSegment'];
angular.module('slamApp').controller('sessionController', sessionController);
