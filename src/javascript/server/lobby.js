var lobby = function (io) {
  object = {
    users: {},
    io: io,
    sockets: {},
    invites: {},
  };

  object.invite = function (inviteeId, user) {
    object.sockets[inviteeId].emit('recieveInvite', user);
    object.invites[user.id].push(inviteeId);
  };

  object.addUser = function (user, socket) {
    if (user.id) {
      object.users[user.id] = user;
      object.io.emit('addLobbyUser', user);
      object.sockets[user.id] = socket;
      object.invites[user.id] = [];
    }
  };

  object.cancelInvite = function (inviteeId, user) {
    object.sockets[inviteeId].emit('cancelInvite', user);
    var index = object.invites[user.id].indexOf(inviteeId);
    object.invites[user.id].splice(index, 1);
  };

  object.cancelAllInvites = function (user) {
    var a = object.invites[user.id];
    a.forEach(function (inviteeId) {
      object.cancelInvite(inviteeId, user);
    });
    delete object.invites[user.id];
  };

  object.removeUser = function (user) {
    if (user.id) {
      delete object.users[user.id];
      delete object.sockets[user.id];
      object.cancelAllInvites(user);
      object.io.emit('removeLobbyUser', user.id);
    }
  };

  return object;
};

module.exports = lobby;
