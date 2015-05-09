function sessionController($scope, $sessionService, $routeSegment) {
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
    $sessionService.login($scope.user, reload, setError);
  };

  $scope.register = function () {
    resetError();
    $sessionService.register($scope.user, reload, setError);
  };

}

sessionController.$inject = ['$scope', '$sessionService', '$routeSegment'];
angular.module('slamApp').controller('sessionController', sessionController);
