const express = require('express')
const path = require('path')
var dotenv = require('dotenv');
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
const { Pool } = require('pg');
const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var appRouter = require('./routes/app');

const PORT = process.env.PORT || 5000

dotenv.load();

var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);

// You can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});


var sess = {
  secret: 'THIS IS A DIFFERENT SECFET',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

//if (app.get('env') === 'production') {
  sess.cookie.secure = false; // serve secure cookies, requires https
//}


/**
 * The purpose of this middleware is to have the `user`
 * object available for all views.
 *
 * This is important because the user is used in layout.pug.
 */
var userInViews = function () {
  return function (req, res, next) {
    res.locals.user = req.user;
    next();
  };
};

var dbInViews = function () {
  return function (req, res, next) {
    res.locals.dbPool = dbPool;
    next();
  };
};

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(cookieParser())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(session(sess))
  .use(passport.initialize())
  .use(passport.session())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(userInViews())
  .use(dbInViews())
  .use('/', authRouter)
  .use('/', indexRouter)
  .use('/', appRouter)
  .use(function(req, res, next){
    // This catches anything that didn't match above
    res.status(404);
    res.type('txt').send('Not found!');
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
