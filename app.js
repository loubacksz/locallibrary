const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// database packages
const mysql = require('mysql');
const mysql2 = require('mysql2');
const Sequelize = require('sequelize');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// orm configuration
const sequelize = new Sequelize('locallibrary', 'root', 'V01d3m0rt', {
  host: 'localhost',
  dialect: 'mysql'
});

try {
  async function test () {await sequelize.authenticate();}
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

module.exports = {app, sequelize};