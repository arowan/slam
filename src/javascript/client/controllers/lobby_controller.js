function lobbyController($scope, $socketService, $sessionService) {
  $scope.users = [];

  $socketService.global.emit('lobby', $sessionService.currentUser);
  
  $socketService.global.on('lobby', function (data) {
    $scope.$apply(function () {
      $scope.users = data.users;
    });
  });

  $socketService.global.on('addLobbyUser', function (user) {
    $scope.$apply(function () {
      $scope.users.push(user);
    });
  });
}

lobbyController.$inject = ['$scope', '$socketService', '$sessionService'];
angular.module('slamApp').controller('lobbyController', lobbyController);
