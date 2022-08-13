var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const expresshbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

require('./confirm_passport/passport');
// express handlebars
//when use express handlebars shoud delete the views
app.engine('.hbs',expresshbs({defaultLayout:'layout',extname:'.hbs',helpers :{
checkMinus : function (value){
 if(value <= 1){
   return true ;
 }
 else{
   return false;
 }
}

}}))

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret :'shoppingcart_?@',
  saveUninitialized:false,
  resave: true ,     
  //not install all time
}));
app.use(flash());    // for express  session

app.use(passport.initialize()); //
app.use(passport.session());   //

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/shoppingcarts',{useNewUrlparser:true},(error)=>{
  if(error){
console.log(error);
  }
  else{
console.log('its connected to database : shopping-cartes');
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
