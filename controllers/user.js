// now we are creating the controllers! 

// first we need to import the modules - we'll later be using to access and update our data
const Book = require('../models/book');
const Author = require('../models/author');
const GenreBook = require('../models/genrebook');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');
const associations = require('../models/associations');

// importing validation and sanitization methods
const { body, validationResult } = require('express-validator');
/* this is just a function call that returns an object, and we DESTRUCTURE the two properties, 'body' and 'validationResult', from the object, 
   so we can use them as variables directly */

// Load Associations
associations();

// then exports functions for each of the URLs we wish to handle

exports.user_signup_get = (req, res, next) => {
    res.render('signup_form', {
        title: "It's great to have you with us!"
    });
}

exports.user_signup_post = (req, res, next) => {
    res.send("NOT IMPLEMENTED");
}

exports.user_login_get = (req, res, next) => {
    res.render('login_form', {
        title: 'Welcome to Local-Library'
    });
}

exports.user_login_post = (req, res, next) => {
    res.send("NOT IMPLEMENTED");
}