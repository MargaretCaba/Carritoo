var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cookieSession = require('cookie-session');
const expressSession = require('express-session') 
const bodyParser = require('body-parser');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const db = require('./database');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var compraHechasRouter = require('./routes/compraHechas');
var carritoRouter = require('./routes/carrito');


var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const sessionId = uuid.v4();
const hashedSessionId = bcrypt.hashSync(sessionId, 15);


app.use(expressSession({
  resave: true, 
  saveUninitialized: false, 
  secret: hashedSessionId,
  cookie: {secure: false}
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/compraHechas', compraHechasRouter);
app.use('/carrito', carritoRouter);

db();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
