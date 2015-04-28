var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser');

function loginParse (user, cookie) {
  return {username: user.username, id: user._id, _session: cookie};
}

function parseUser (user) {
  return {username: user.username, id: user._id};
}

function buildCookie (req, user) {
  var cookieHash = bcrypt.hashSync(user._id);
  var db = req.db;
  var collection = db.get('users');
  var promise = collection.update({_id: user._id.toString()}, {$set:{cookieHash: cookieHash}});
  return cookieHash;
}

function login (req, done) {
  var db = req.db;
  var collection = db.get('users');
  var username = req.body.username;

  collection.findOne({username: username}, {}, function (err, user) {
    if (err) return done(err, null, null, 500);
    if (!user) {
      return done(null, false, {'error': 'invalid username / password'}, 406);
    }
    if (user && !bcrypt.compareSync(req.body.password, user.password)) {
      return done(null, false, {'error': 'invalid username / password'}, 406);
    }
    var cookie = buildCookie(req, user);
    done(null, loginParse(user, cookie), null, 200);
  });
}

function register (req, done) {
  var db = req.db;
  var collection = db.get('users');
  
  var username = req.body.username;
  var password = req.body.password;

  collection.findOne({username: username}, function (err, user) {
    if (err) return done(err, null, null, 500);
    if (user) return done(null, false, {'error' : 'username already taken'}, 409);
    if (!user) {
      collection.insert({username: username, password: bcrypt.hashSync(password)}, function (err, user) {
        if (err) return done(err, null, null, 500);
        var cookie = buildCookie(req, user);
        done(null, loginParse(user, cookie), null, 200);
      });
    }
  });
}

router.post('/register', function (req, res, next) {
  register(req, function (err, user, info, status) {
    var data = null;
    data = (user) ? user : info;
    res.status(status).json(data);
  });
});  

router.post('/login', function (req, res, next) {
  login(req, function (err, user, info, status) {
    var data = null;
    data = (user) ? user : info;
    res.status(status).json(data);
  });
});

router.delete('/current', function (req, res) {
  var cookie = req.cookies._slam_session;
  var db = req.db;
  var collection = db.get('users');
  if (cookie) {
    collection.update({cookieHash: cookie}, {$set:{cookieHash: null}});
    res.sendStatus(204);
  } else {
    res.status(401).json({error: 'not authenticated'});
  }
});

router.get('/current', isAuthenticated, function(req, res){
  res.json(res.user);
});


function isAuthenticated (req, res, next) {
  var cookie = req.cookies._slam_session;
  var db = req.db;
  var collection = db.get('users');
  if (cookie) {  
    collection.findOne({cookieHash: cookie}, {}, function (err, user) {
      if (err) res.status(401).json({error: 'not authenticated'});
      if (user) {
        res.user = parseUser(user);
        return next();
      }
      res.status(401).json({error: 'not authenticated'});
    });
  } else {
    res.status(401).json({error: 'not authenticated'});
  }
}

module.exports = router;
