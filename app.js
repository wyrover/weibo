var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');

var app = express();
var server = require('http').createServer(app);


//port setup
app.set('port', process.env.PORT || 3000);


// view engine setup
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes(app);

// server listener
server.listen(app.get('port'), function(){
  console.log('Server is listening on port ' + app.get('port'));
});



module.exports = app;
