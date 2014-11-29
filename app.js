var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var generate_key = function() {
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
};

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Consider all URLs under /public/ as static files, and return them raw.
app.use(express.static(path.join(__dirname, 'public')));
// Session framework
app.use(session({secret: generate_key()}));
console.log(generate_key());

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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

function getName(req, res) {
  if (req.session.name) {
    return res.json({ name: req.session.name });
  }
  else {
    return res.json({ name: '' });
  }
}

function setName(req, res) {
  if(!req.body.hasOwnProperty('name')) {
    res.statusCode = 400;
    return res.json({ error: 'Invalid message' });
  }
  else {
    req.session.name = req.body.name;
    return res.json({ name: req.body.name });
  }
}

function logout(req, res) {
  req.session = null;
  return res.json({});
}


app.get('/name', getName);
app.post('/name', setName);
app.get('/logout', logout);

module.exports = app;
