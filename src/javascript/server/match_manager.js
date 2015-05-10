var Match = require('./match.js');
var base64url = require('base64url');

var matchManager = {
  matches: []
};

matchManager.add = function (io) {
  var channel = base64url.encode(String(Date.now()));
  var m = new Match();
  this.matches.push(m);
  return m;
};

module.exports = matchManager;
