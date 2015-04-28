function userController($scope, user, sessionService) {
  sessionService.setCurrentUser(user);

  $scope.logout = function () {
    sessionService.logout();
  };
}

userController.$inject = ['$scope', 'user', 'sessionService'];
angular.module('slamApp').controller('userController', userController);
