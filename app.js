const createError = require('http-errors');
const path = require('path');

const express = require('express');

const logger = require('morgan');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index');
const trainingSessionRouter = require('./routes/trainingSessionRouter.js');

const errorHandler = require('./middleware/errorHandler.js')
const dbConnection = require('./config/dbConnection.js');
const app = express();


// template engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// middleware chain ("app.use" from top to down)
app.use(logger('dev'));                                       // log http request

app.use(express.json());                                      // parse json http request
app.use(express.urlencoded({ extended: false }));             // parse url-encoded http request
app.use(cookieParser());                                      // parse cookies (if exists)

app.use(express.static(path.join(__dirname, 'public')));      // allows responding with static file (in "public" directory) if requested (by browser)


// database connection
dbConnection.connectToLocalDatabase();


// routers setup
app.use('/', indexRouter);                                    // for all "/" http-requests refer to indexRouter
app.use('/session/', trainingSessionRouter);


// catch 404 (if requested route do not exists) and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// global error handler
app.use(errorHandler);

// export configured Express application variable to use it in "/bin/www" for starting HTTP server
module.exports = app;