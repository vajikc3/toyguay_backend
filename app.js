'use strict';

var express = require('express');
var path = require('path');
require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var translate = require ('./lib/translator');

var app = express();

// Conexion a la base de datos
require('./lib/connectMongoose');

// Los modelos
require('./models/Toy'); // Modelo de anuncios
require('./models/User');
require('./models/Token');
require('./models/Search');
require('./models/Transaction');
require('./models/Category');




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*___------===== Las rutas ====-------______*/

app.use('/', require('./routes/index'));
app.use('/api/v1/users', require('./routes/api/v1/users'));
app.use('/api/v1/toys',require('./routes/api/v1/toys'));
//app.use('/images/anuncios',require('./routes/imagenes'));
app.use('/api/v1/tokens',require('./routes/api/v1/tokens'));
app.use('/api/v1/images',require('./routes/api/v1/images'));
app.use('/api/v1/searches',require('./routes/api/v1/searches'));
app.use('/api/v1/transactions',require('./routes/api/v1/transactions'));
app.use('/api/v1/categories',require('./routes/api/v1/categories'));





//var express = require('express');
//var router = express.Router();

/* GET users listing. */
/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
*/

// Meto mi manejador especial que traduce
app.use(function(req, res, next) {
  //-- Lo que leemos
  var errorText;

  console.log('Peticiones ->',req.query);

  if (req.query.lan === undefined){
    errorText = translate('PAGE_NOT_FOUND','es');
  }
  else{
    errorText = translate('PAGE_NOT_FOUND',req.query.lan);
  }

  console.log('por que no sale esto...',errorText);
  var err = new Error(errorText);
  err.status = 404;
  next(err);
});



/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
