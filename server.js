// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/slam');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  req.db = db;
  next();
});

// Routing
var users = require('./src/javascript/server/users.js');

app.use(express.static(__dirname + '/public'));

app.use('/api/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

module.exports = app;
