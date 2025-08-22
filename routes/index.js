const express = require('express');
const router = express.Router();

// middleware - a function/piece of software that will run on the 
// applications request-response cycle

// they have access to the req and res objects and the next() function

// a middleware must call the next() function if it doesn't terminate
// the request, otherwise, the request will be left hanging

// next() - when invoked, executes the middleware succeding the current one 

/* GET home page. */
router.get('/', function(req, res) {

  // This redirects to the specified page, by default sending HTTP status code "302 Found". 
  // You can change the status code returned if needed, and supply either absolute or relative paths

  res.redirect('/catalog');

});

module.exports = router;
