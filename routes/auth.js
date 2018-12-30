var express = require('express');
var router = express.Router();
var passport = require('passport');

// Perform the login, after login Auth0 will redirect to callback
router.get('/auth/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}), function (req, res) {
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/auth/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      console.log("Error: User variable not set by login")
      return res.redirect('/');
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || '/app/');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
