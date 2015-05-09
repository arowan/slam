function lobbyController($scope, $socketService, $sessionService) {
  $scope.users = {};
  $scope.invites = [];

  $scope.hasUsers = function () {
    return Object.keys($scope.users).length > 0;
  };

  $scope.isLoggedIn = function () {
    return !!$sessionService.currentUser;
  };

  $scope.sendInvite = function (invitee) {
    $socketService.global.emit('sendInvite', invitee);
  };

  $scope.acceptInvite = function (invitee) {
    $socketService.global.emit('acceptInvite', invitee);
  };

  if ($scope.isLoggedIn()) {  
    $socketService.global.emit('lobby', $sessionService.currentUser);
    
    $socketService.global.on('lobby', function (data) {
      $scope.$apply(function () {
        $scope.users = data.users;
      });
    });

    $socketService.global.on('addLobbyUser', function (user) {
      $scope.$apply(function () {
        $scope.users[user.id] = user;
      });
    });


    $socketService.global.on('removeLobbyUser', function (id) {
      $scope.$apply(function (){
        delete $scope.users[id];
      });
    });

    $socketService.global.on('recieveInvite', function (user) {
      $scope.$apply(function () {
        $scope.invites.push(user);
      });
    });

    $socketService.global.on('cancelInvite', function (user) {
      $scope.$apply(function (){
        var index = $scope.invites.indexOf(user);
        $scope.invites.splice(index, 1);
      });
    });

  }


}

lobbyController.$inject = ['$scope', '$socketService', '$sessionService'];
angular.module('slamApp').controller('lobbyController', lobbyController);
