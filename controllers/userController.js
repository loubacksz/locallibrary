// now we are creating the controllers! 

// first we need to import the modules - we'll later be using to access and update our data
const Password = require('../models/password');
const User = require('../models/user');
const associations = require('../models/associations');
const bcrypt= require('bcrypt');
const sequelize = require('../db/dbConnection');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// importing validation and sanitization methods
const { body, validationResult } = require('express-validator');
const { IGNORE } = require('sequelize/lib/index-hints');
/* this is just a function call that returns an object, and we DESTRUCTURE the two properties, 'body' and 'validationResult', from the object, 
   so we can use them as variables directly */

// Load Associations
associations();

// create jwt
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: maxAge
    });
}

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
        .isLength({ min: 3 })
        .escape(),

    body("name", "Name must contain only letters")
        .trim()
        .isAlpha('en-US', {ignore: " "})
        .escape(),

    body("email", "Invalid e-mail")
        .trim()
        .isAscii()
        .isEmail()
        .escape(),

    body("password", "Password must contain at least 8 characters - 1 lowercase, 1 uppercase, 1 number, 1 symbol")
        .trim()
        .isAscii()
        .isStrongPassword()
        .escape(),

    // signup logic
    async (req, res) => {
        try{
            // 0 - checking and catching form errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) { //* there are errors *//
                // rendering the same page again
                res.render('signup_form', {
                    errors: errors.array(),
                    title: "It's great to have you with us!",
                    name: req.body.name,
                    email: req.body.email,
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

            // lowering email
            const lowered_email = req.body.email.toLowerCase();
        
            if (email.length > 0){ 
                let count = 0;
                do {
                    if (lowered_email === email[count].user_email) {
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
                user_name: req.body.name.toLowerCase(), //* formating name *//
                user_email: lowered_email, //* formating email *//
                role_id: 2
            });
            const userTxt = JSON.stringify(userRaw);
            const user = JSON.parse(userTxt);

            // 3 - create pwd
            await bcrypt.genSalt(async (err, salt) => {
                await bcrypt.hash(req.body.password, salt, async (err, hash) => {
                    await Password.create({
                        user_id: user.user_id,
                        user_salt: salt,
                        user_password: hash
                    });
                });
            });

            // 4 - create jwt
            const token = createToken(user.user_id);

            // 5 - attach jwt to a cookie
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

            //  - render catalog
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
    body("email", "Invalid e-mail")
        .trim()
        .isAscii()
        .isEmail()
        .escape(),

    body("password", "Invalid password")
        .trim()
        .isAscii()
        .isStrongPassword()
        .escape(),
    
    // login logic
    async (req, res) => {
        try {
            // 0 - checking and catching form errors
            const errors = validationResult(req);

            const lowered_email = req.body.email.toLowerCase(); //* lowering email *//

            if(!errors.isEmpty()){
                // there are errors
                res.render('login_form', {
                    title: 'Welcome to Local-Library',
                    errors: errors.array(),
                    email: lowered_email,
                    password: req.body.password
                });
                return;
            }

            // 1 - request user
            const user_data = await sequelize.query('SELECT user_password, user_salt, user.user_email, user.user_id, role.role_name ' +
                                                    'FROM password ' +
                                                    'INNER JOIN user ' +
                                                    'ON password.user_id = user.user_id ' +
                                                    'INNER JOIN role ' +
                                                    'ON user.role_id = role.role_id ' +
                                                    'WHERE user.user_email = ? ', { replacements: [`${lowered_email}`], type: sequelize.QueryTypes.SELECT });
            
            // 2 - checking user and database errors
            if (user_data.length === 0) {
                const errors = [{ msg: 'E-mail not registered!' }];
                res.render('login_form', {
                    errors: errors,
                    title: 'Welcome to Local-Library',
                    email: lowered_email,
                    password: req.body.password
                });
                return;
            }

            // 3 - hashing user pwd input    
            const hashed_user_input = await bcrypt.hash(req.body.password, user_data[0].user_salt);
            // 3.1 - comparing user pwd input with pwd in the database
            if (hashed_user_input === user_data[0].user_password) {
                // 4 - create jwt
                const token = createToken(user_data[0].user_id);

                // 5 - attach jwt to a cookie
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                
                // 6 - render index
                res.redirect('/catalog');
            } else {
                const errors = [{ msg: 'Incorrect password' }];
                res.render('login_form', {
                    errors: errors,
                    title: 'Welcome to Local-Library',
                    email: lowered_email,
                    password: req.body.password
                });
                return;
            }
        } catch(err) {
            console.log(err);
        }
    }
]

exports.user_logout_get = (req, res, next) => {
    res.cookie('jwt', '',{ httpOnly: true, maxAge: 1, expires: 1 });
    res.redirect('/users/login');
}