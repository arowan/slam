var base64url = require('base64url');

function Match (io) {
  this.players = [];
  this.io = io;
  this.channel = base64url.encode(String(Date.now()));
  this.room = io.of(this.channel);

  this.room.on('connection', function (socket){
    console.log('welcome to ', this.channel);
  });

}

Match.prototype.pre = function() {
  
};

module.exports = Match;
