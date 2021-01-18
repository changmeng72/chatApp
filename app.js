const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const logger = require("morgan");
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const mongoSessionStore = require('connect-mongo');
const jwt = require('jsonwebtoken');
const apiRouter = require('./routes/api');
const next = require('next');
const cookieParser = require('cookie-parser');


require('dotenv').config();
 
//mongo db connection:

const MONGO_URL = process.env.MONGO_URL_TEST;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
mongoose.connect(MONGO_URL, options);

const { json, urlencoded } = express;

//next app:
nextApp = next({ dev: true }); 
const handle = nextApp.getRequestHandler();

//express  init
const app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
//session support with mongo store
const MongoStore = mongoSessionStore(session);
app.use(session({
    name: process.env.SESSION_NAME || "chatApp_ppa",
    secret: process.env.SESSION_SECRET || 'DefAult1^&%@@>:ASAZ(DS#$@d0',
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 7 * 24 * 60 * 60, // save session 14 days
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },

}));
//cors
app.use(cors({ origin: true }));

//api router - login/logout/signup/getuser/gettoken/getusers
app.use('/api', apiRouter);

//init next.js
nextApp.prepare().then(() => {

  //http route:
/*
  app.get('/login', async (req, res) => {
     handle(req, res);
  });


  app.get('/chat', async (req, res) => {
    if (req.session && req.session.userId)
      handle(req, res);
    else
      res.redirect('/login');
  });
   app.get('/', async (req, res) => {
    if (req.session && req.session.userId)
      res.redirect('/chat');
    else
      res.redirect('/login');
  });
*/

  app.get('*', async (req, res) => {
    handle(req, res);
  });

 // app.use(express.static(join(__dirname, "public")));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("404");
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});
});





module.exports = app;
