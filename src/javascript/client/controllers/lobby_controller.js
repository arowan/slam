function lobbyController($scope, $socketService, $sessionService, $location) {
  $scope.users = {};
  $scope.invites = [];

  var cancelInvite = function (sessionId) {
    var user = $scope.users[sessionId];
    var index = $scope.invites.indexOf(user);
    if (index > -1) $scope.invites.splice(index, 1);
  };

  $scope.hasUsers = function () {
    return Object.keys($scope.users).length > 0;
  };

  $scope.isLoggedIn = function () {
    return !!$sessionService.currentUser;
  };

  $scope.sendInvite = function (invitee) {
    $socketService.lobby.emit('invite', invitee);
  };

  $scope.acceptInvite = function (invitee) {
    $socketService.lobby.emit('accept', invitee);
  };

  if ($scope.isLoggedIn()) {  
    $socketService.joinLobby($sessionService.currentUser);
   
    $socketService.lobby.on('lobbyUsers', function (data) {
      $scope.$apply(function () {
        $scope.users = data.users;
      });
    });

    $socketService.lobby.on('addLobbyUser', function (data) {
      $scope.$apply(function () {
        var key = Object.keys(data)[0];
        $scope.users[key] = data[key];
      });
    });

    $socketService.lobby.on('removeLobbyUser', function (sessionId) {
      $scope.$apply(function (){
        cancelInvite(sessionId);
        delete $scope.users[sessionId];
      });
    });

    $socketService.lobby.on('recieveInvite', function (sessionId) {
      $scope.$apply(function () {
        var user = $scope.users[sessionId];
        $scope.invites.push({id: sessionId, user: user});
      });
    });

    $socketService.lobby.on('cancelInvite', function (sessionId) {
      $scope.$apply(function (){
        cancelInvite(sessionId);
      });
    });

    $socketService.lobby.on('joinMatch', function (matchChannel) {
      $scope.$apply(function (){
        $location.path('/match/' + matchChannel);
      });
    });

  }
}

lobbyController.$inject = ['$scope', '$socketService', '$sessionService', '$location'];
angular.module('slamApp').controller('lobbyController', lobbyController);
