var express = require('express');
var path = require('path');
var db = require('./db');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressJwt=require('express-jwt');
var jwt=require('jsonwebtoken');
var Faye = require('faye');
var bayeux = new Faye.NodeAdapter({ mount: '/faye', timeout: 45 });
var client = bayeux.getClient();
var routes = require('./routes/index');
var users = require('./routes/users');
var team = require('./routes/team');

//var message = require('./routes/message');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('bayeux',bayeux);
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
//app.use('/api', expressJwt({secret: 'secret'}));
app.use('/api/users', users);
app.use('/api/team', team);
/* POST message*/
app.post('/message', function(req, res) {
    app.get('bayeux').getClient().publish('/channel', { text: req.body.message });
    console.log('broadcast message:' + req.body.message);
    res.status(200).send({ message: 'Success' });
});
app.post('/authenticate',function(req,res){
   
  //TODO validate req.body.username and req.body.password
  //if is invalid, return 401
  if (!(req.body.username === 'r' && req.body.password === 'r')) {
    res.send(401, 'Wrong user or password');
    return;
  }

  var profile = {
    first_name: 'R',
    last_name: 'r',
    email: 'john@doe.com',
    username:'rahulr'

  };

  // We are sending the profile inside the token
  var token = jwt.sign(profile, 'secret', { expiresInMinutes: 60*5 });

  res.json({ token: token });
});
/// catch 404 and forward to error handler
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
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });

    
});

module.exports = app;
