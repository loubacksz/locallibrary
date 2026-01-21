const express = require('express');
const router = express.Router();

// require controller modules
const user_controller = require('../controllers/userController');

/// SIGN UP ROUTES ///

// GET users sign-up page
router.get('/signup', user_controller.user_signup_get);

// POST users sign-up page
router.post('/signup', user_controller.user_signup_post);

/// LOGIN ROUTES ///

// GET users login page
router.get('/login', user_controller.user_login_get);

// POST users login page
router.post('/login', user_controller.user_login_post);

// this router object is used by the express app
module.exports = router;
