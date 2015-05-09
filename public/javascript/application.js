angular.module('slamApp', [
  'ngRoute', 
  'ngCookies',
  'route-segment', 
  'view-segment',
  'slamFactories', 
  'slamServices',
  'slamFilters',
  'slamDirectives'
  ])
  .config(['$routeSegmentProvider', function ($routeSegmentProvider) {
    
    $routeSegmentProvider.options.autoLoadTemplates = true;
    $routeSegmentProvider
      .when('/', 'user.board')

      .segment('user', {
        templateUrl: 'templates/user.html',
        controller: userController,
        resolve: {
          user: ['sessionService', function (sessionService) {
            return sessionService.current();
          }]
        },
        resolveFailed: {
          templateUrl: 'templates/session.html',
          controller: sessionController
        }
      })

      .within()
        .segment('board', {
          controller: boardController,
          templateUrl: 'templates/board.html'
        })
        .up()
      .up();


  }]);

angular.module('slamFactories', []);
angular.module('slamServices', []);
angular.module('slamFilters', []);
angular.module('slamDirectives', []);

function boardController($scope) {
  $scope.cards = ['2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', 'jh', 'qh', 'kh', 'ah', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', '10d', 'jd', 'qd', 'kd', 'ad', '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', '10c', 'jc', 'qc', 'kc', 'ac', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '10s', 'js', 'qs', 'ks', 'as'];

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

function sessionController($scope, sessionService, $routeSegment) {
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
    sessionService.login($scope.user, reload, setError);
  };

  $scope.register = function () {
    resetError();
    sessionService.register($scope.user, reload, setError);
  };

}

sessionController.$inject = ['$scope', 'sessionService', '$routeSegment'];
angular.module('slamApp').controller('sessionController', sessionController);

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

function card () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      face: '@'
    },
    templateUrl: '/templates/components/card_template.html',
    link: function (scope, element) {
      scope.onMove = function (data) {
        console.log(data, event);
      };
    }
  };
}

angular.module('slamDirectives').directive('card', card);

function drag ($document) {
  return {
    restrict: 'A',
    scope: {
      onMove: '='
    },
    link: function (scope, element) {
      var startX = 0, startY = 0, x = 0, y = 0;

      element.css({
       position: 'relative',
       cursor: 'pointer'
      });

      element.on('mousedown', function(event) {
        event.preventDefault();
        startX = event.pageX - x;
        startY = event.pageY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;
        element.css({
          top: y + 'px',
          left:  x + 'px'
        });
        if (scope.onMove) scope.onMove({x:x, y:y});
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    }
  };
}

drag.$inject = ['$document'];
angular.module('slamDirectives').directive('drag', drag);

function sessionService ($http, $cookies, $q) {

  var object = {
    currentUser: null
  };

  var setCookie = function (session) {
    $cookies._slam_session = session;
  };

  var postRequest = function (url, data, success, error) {
    var promise = $http.post(url, data);
    promise.then(function (response) {
      var user = response.data;
      setCookie(user._session);
      if (success) success(user);
    }, function (response) {
      var e = response.data;
      if (error) error(e);
    });
  };

  object.setCurrentUser = function (user) {
    object.currentUser = user;
  };

  object.current = function () {
    return $q(function (resolve, reject) {
      $http.get('/api/users/current').then(function (response) {
        var user = response.data;
        object.setCurrentUser(user);
        resolve(object.currentUser);
      },function (response) {
        reject(response);
      });
    });
  };

  object.login = function (data, success, error) {
    postRequest('/api/users/login', data, success, error);
  };

  object.logout = function (success, error) {
    var promise = $http.delete('/api/users/current');
    promise.then(function (response) {
      setCookie(null);
      if (success) success();
    }, function (response) {
      var e = response.data;
      if (error) error(e);
    });
  };

  object.register = function (data, success, error) {
    postRequest('/api/users/register', data, success, error);
  };

  return object;

}

sessionService.$inject = ['$http', '$cookies', '$q'];
angular.module('slamServices').service('sessionService', sessionService);
