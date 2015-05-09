function userController($scope, user, $sessionService, $routeSegment, $socketService) {
  $scope.currentUser = user;
  $scope.segment = $routeSegment.chain[0];

  function reload () {
    $socketService.disconnect();
    $scope.segment.reload();
  }

  $scope.logout = function () {
    $sessionService.logout(reload);
  };
}

userController.$inject = ['$scope', 'user', '$sessionService', '$routeSegment', '$socketService'];
angular.module('slamApp').controller('userController', userController);
