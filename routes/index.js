const express = require('express');
const router = express.Router();

// middleware - a function/piece of software that will run on the 
// applications request-response cycle

// they have access to the req and res objects and the next() function

// a middleware must call the next() function if it doesn't terminate
// the request, otherwise, the request will be left hanging

// next() - when invoked, executes the middleware succeding the current one 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
