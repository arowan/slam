function $socketService () {
  var host = 'http://localhost:3000';
  
  var object = {
    host: host,
    global: io.connect(host)
  };

  object.disconnect = function () {
    return this.global.disconnect();
  };

  object.joinLobby = function (user) {
    this.lobby = io.connect(this.host + '/lobby');
    this.lobby.emit('register', user);
  };

  object.joinMatch = function (id) {
    this.match = io.connect(this.host + id);
  };

  return object;
}

$socketService.$inject = [];
angular.module('slamServices').service('$socketService', $socketService);
