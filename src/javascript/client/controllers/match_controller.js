function matchController($scope, $socketService, user, $routeParams) {
  $scope.cards = ['2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', 'jh', 'qh', 'kh', 'ah', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', '10d', 'jd', 'qd', 'kd', 'ad', '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', '10c', 'jc', 'qc', 'kc', 'ac', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '10s', 'js', 'qs', 'ks', 'as'];
  $scope.hand = [];
  
  $socketService.joinMatch($routeParams.id);

}

matchController.$inject = ['$scope', '$socketService', 'user', '$routeParams'];
angular.module('slamApp').controller('matchController', matchController);
