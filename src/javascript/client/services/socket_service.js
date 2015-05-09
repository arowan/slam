function $socketService () {
  var object = {
    global: io.connect('http://localhost:3000')
  };

  object.connect = function (channel) {
    object[channel] = io.connect('http://localhost:3000/' + channel);
  };

  return object;
}

angular.module('slamServices').service('$socketService', $socketService);
