// now we are creating the controllers! 

// first we need to import the modules - we'll later be using to access and update our data
const Book = require('../models/book');
const Author = require('../models/author');
const GenreBook = require('../models/genrebook');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');
const Password = require('../models/password');
const User = require('../models/user');
const associations = require('../models/associations');
const bcrypt = require('bcrypt');

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

exports.user_signup_post = [
    // validate and sanitize
    body("name", "Name must contain at least 3 characters")
        .trim()
        .isString()
        .isLength({ min: 3 })
        .escape(),

    body("email", "Invalid e-mail")
        .trim()
        .isAscii()
        .isEmail()
        .escape(),

    body("password", "Password must contain at least 8 characters - 1 lowercase, 1 uppercase, 1 number and 1 symbol")
        .trim()
        .isAscii()
        .isStrongPassword()
        .escape(),

    // signup logic
    async (req, res) => {
        try{
            // 0 - checking and catching form errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // there are errors

                // rendering the same page again
                res.render('signup_form', {
                    errors: errors.array(),
                    title: "It's great to have you with us!"
                });
                return;
            }

            // 1 - checking and catching database errors
            const emailRaw = await User.findAll({
                attributes: ['user_email'],
                where: {
                    user_email: req.body.email
                }
            });
            const emailTxt = JSON.stringify(emailRaw);
            const email = JSON.parse(emailTxt);

            if (email.length > 0){ 
                let count = 0;
                do {
                    if (req.body.email.toLowerCase() === email[count].user_email) {
                        const errors = [{ msg: 'E-mail already in use!' }];
                        res.render('signup_form', {
                            errors: errors,
                            title: "It's great to have you with us!"
                        });
                        return;
                    }
                    count += 1;
                } while (count < email.length);
            }

            // 2 - create user
            const userRaw = await User.create({
                user_name: req.body.name.toLowerCase(), /* formating name */
                user_email: req.body.email.toLowerCase(), /* formating email */
                role_id: 2
            });
            const userTxt = JSON.stringify(userRaw);
            const user = JSON.parse(userTxt);

            // 3 - create pwd
            await bcrypt.genSalt(async (err, salt) => {
                await bcrypt.hash('password', salt, async (err, hash) => {
                    await Password.create({
                        user_id: user.user_id,
                        user_salt: salt,
                        user_password: hash
                    });
                });
            });

            // 4 - render catalog
            res.redirect('/catalog');
        } catch (err) {
            console.log(err);
        }

    }
]

exports.user_login_get = (req, res, next) => {
    res.render('login_form', {
        title: 'Welcome to Local-Library'
    });
}

exports.user_login_post = [
    // validate and sanitize
    body("name", "Name must contain at least 3 characters")
        .trim()
        .isString()
        .isLength({ min: 3 })
        .escape(),

    body("email", "Invalid e-mail")
        .trim()
        .isAscii()
        .isEmail()
        .escape(),

    body("password", "Password must contain at least 8 characters - 1 lowercase, 1 uppercase, 1 number and 1 symbol")
        .trim()
        .isAscii()
        .isStrongPassword()
        .escape(),
]