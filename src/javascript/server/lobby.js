var matchMaker = require('./match_manager.js');

var lobby = function (io) {
  object = {
    users: {},
    io: io,
    channel: 'lobby',
    room: io.of('lobby'),
    invites: {}
  };

  var sendObject = function (socket) {
    var o = {};
    o[socket.id] = socket.user;
    return o;
  };

  object.room.on('connection', function (socket) {
   
    socket.on('register', function (user) {
      socket.emit('lobbyUsers', {users: object.users});
      socket.user = user;
      object.join(socket);
    });

    socket.on('disconnect', function () {
      object.leave(socket);
    });

    socket.on('accept', function (inviteeId) {
      var match = matchMaker.add(object.io);
      socket.emit('joinMatch', match.channel);
      socket.broadcast.to(inviteeId).emit('joinMatch', match.channel);
    });

    socket.on('invite', function (inviteeId) {
      if (!object.isInvited(socket, inviteeId)) {
        socket.broadcast.to(inviteeId).emit('recieveInvite', socket.id);
        object.invite(socket, inviteeId);
      }
    });

    socket.on('cancelInvite', function (inviteeId) {
      if (object.isInvited(socket, inviteeId)) {
        socket.broadcast.to(inviteeId).emit('cancelInvite', socket.id);
        object.cancelInvite(socket, inviteeId);
      }
    });

  });

  object.join = function (socket) {
    this.users[socket.id] = socket.user;
    this.invites[socket.id] = [];  
    this.room.emit('addLobbyUser', sendObject(socket));
  };

  object.leave = function (socket) {
    delete this.users[socket.id];
    delete this.invites[socket.id];
    this.room.emit('removeLobbyUser', socket.id);
  };

  object.isInvited = function (socket, inviteeId) {
    return this.invites[socket.id].indexOf(inviteeId) > -1;
  };

  object.invite = function (socket, inviteeId) {
    this.invites[socket.id].push(inviteeId);
  };

  object.cancelInvite = function (socket, inviteeId) {
    var index = this.invites[socket.id].indexOf(inviteeId);
    this.invites[socket.id].splice(index, 1);
  };

  return object;
};

module.exports = lobby;
