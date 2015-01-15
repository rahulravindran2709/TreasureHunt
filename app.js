var express = require('express');
var path = require('path');
var db = require('./db');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressJwt=require('express-jwt');

var Faye = require('faye');
var bayeux = new Faye.NodeAdapter({ mount: '/faye', timeout: 45 });
var client = bayeux.getClient();
var routes = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');
var team = require('./routes/team');
var unique = require('./routes/unique');

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
app.use('/api/unique',unique);
app.use('/authenticate',auth);
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
