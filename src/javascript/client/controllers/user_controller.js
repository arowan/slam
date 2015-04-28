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
