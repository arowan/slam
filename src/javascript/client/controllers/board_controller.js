function boardController($scope) {
  $scope.cards = ['1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', 'jh', 'qh', 'kh', 'ah', '1d', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', '10d', 'jd', 'qd', 'kd', 'ad', '1c', '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', '10c', 'jc', 'qc', 'kc', 'ac', '1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '10s', 'js', 'qs', 'ks', 'as'];

  $scope.hand = [];

  (function(){
    var i;
    for (i = 0; i < 5; i++) {
      var index = Math.floor((Math.random() * 51) + 1);
      $scope.hand.push($scope.cards.splice(index, 1)[0]);
    }
  })();


}

boardController.$inject = ['$scope'];
angular.module('slamApp').controller('boardController', boardController);
