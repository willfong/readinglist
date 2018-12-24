var express = require('express');
var router = express.Router();

// TODO: Move this function globally 
var secured = function () {
    return function secured (req, res, next) {
      if (req.user) { return next(); }
      req.session.returnTo = req.originalUrl;
      res.redirect('/');
    };
};

// TODO: Move db connection global
router.get('/app', secured(), async (req, res, next) => {
  try {
    var result
    const client = await res.locals.dbPool.connect()
    result = await client.query("SELECT * FROM books WHERE userid = $1 AND state = 'listed'", [res.locals.user.id]);
    const listed = (result) ? result.rows : null;
    result = await client.query("SELECT * FROM books WHERE userid = $1 AND state = 'started'", [res.locals.user.id]);
    const started = (result) ? result.rows : null;
    result = await client.query("SELECT * FROM books WHERE userid = $1 AND state = 'completed'", [res.locals.user.id]);
    const completed = (result) ? result.rows : null;
    res.render('pages/app', {listed, started, completed});
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

router.post('/app/add', secured(), async (req, res, next) => {
  try {
    const client = await res.locals.dbPool.connect();
    await client.query('INSERT INTO books (userid, title) VALUES ($1, $2)', [res.locals.user.id, req.body.title]);
    res.redirect('/app');
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

router.post('/app/changeBookState', secured(), async (req, res, next) => {
  const bookId = req.body.bookId;
  const newState = req.body.state;
  // TODO: Need to find out why it still tries to run the query
  const valid_states = ['listed', 'started', 'completed', 'abandoned', 'delete']
  if (valid_states.indexOf(newState) < 0) {
    res.send("Error: Not a valid reading state");
  }
  try {
    const client = await res.locals.dbPool.connect();
    if (newState == 'delete') {
      await client.query('DELETE FROM books WHERE id = $1 AND userid = $2', [bookId, res.locals.user.id]);
    } else {
      await client.query('UPDATE books SET state = $1, '+newState+' = NOW() WHERE id = $2 AND userid = $3', [newState, bookId, res.locals.user.id]);
    }
    res.redirect('/app');
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

module.exports = router;
