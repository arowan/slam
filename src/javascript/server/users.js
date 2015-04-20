var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      });
    });
  }
));

router.post('/register', function(req, res, next) {
  var db = req.db;
  var collection = db.get('users');
  // collection.find({username: })
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({error: 'invalid username or password'});
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({'user': user});
    });
  })(req, res, next);
});

router.get('/current', ensureAuthenticated, function(req, res){
  res.json({ user: req.user });
});


// define the home page route
// router.get('/', function(req, res) {
//   var db = req.db;
//   var collection = db.get('users');
//   collection.find({},{},function(e,docs){
//     res.json({'c': docs});
//   });
// });

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.status(401).json({error: 'not authenticated'});
}


module.exports = router;
