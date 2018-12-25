var express = require('express');
var router = express.Router();

// TODO: Move this function globally 
var secured = function () {
    return function secured (req, res, next) {
      if (req.user) { return next(); }
      req.session.returnTo = req.originalUrl;
      res.redirect('/auth/login');
    };
};

// TODO: Move db connection global
router.get('/user/settings', secured(), async (req, res, next) => {
  try {
    const client = await res.locals.dbPool.connect();
    
    result = await client.query("SELECT username FROM users WHERE userid = $1", [res.locals.user.id]);
    const userInfo = (result) ? result.rows[0] : null;

    res.render('pages/user_settings', {userInfo});
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


router.post('/user/settings/change-username', secured(), async (req, res, next) => {
    try {
        const client = await res.locals.dbPool.connect();
        await client.query("INSERT INTO users (userid, username) VALUES ($2, $1) ON CONFLICT (userid) DO UPDATE SET username = $1", [req.body.username, res.locals.user.id]);
        res.redirect('/user/settings');
    } catch (err) {
        console.error(err);
        res.send("Error " + err);       
    }
});


router.get('/:username', async (req, res, next) => {
    try {
        const client = await res.locals.dbPool.connect();

        result = await client.query("SELECT userid, username FROM users WHERE username = $1", [req.params.username]);

        if (result.rowCount == 1) {
            var userInfo = result.rows[0];
            result = await client.query("SELECT * FROM books WHERE userid = $1 ORDER BY state, listed", [userInfo.userid]);
            const userBooks = (result) ? result.rows : null;
            res.render('pages/user_view', {userInfo, userBooks});
        } else {
            res.status(404).send('ERROR: User not found').end();
        }
        // TODO: Find out why the .end() up there still allows code at this position to run

    } catch (err) {
        console.error(err);
        res.send("Error " + err);       
    }
});


module.exports = router;
