// now we are creating the controllers! 

// first we need to import the modules - we'll later be using to access and update our data
const Book = require('../models/book');
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const associations = require('../models/associations');

// importing validation and sanitization methods
const { body, validationResult } = require('express-validator');
    // this is just a function call that returns an object, and we DESTRUCTURE the two properties, 'body' and 'validationResult', from the object, 
    // so we can use them as variables directly

// then exports functions for each of the URLs we wish to handle

// Load Associations
associations();

// Display list of all Genre
exports.genre_list = async (req, res, next) => {
    try{
        const allGenres = await Genre.findAll({
            order: [['name', 'ASC']]
        });
        const text = JSON.stringify(allGenres);
        const json = JSON.parse(text);

        res.render('genre_list', {
            title: "Genre List",
            genre_list: json,
        });
    } catch(err){
        console.log('debbug: ' + err);
    }
};

// Display detail page for a specific Genre
exports.genre_detail = async (req, res, next) => {
    try{
        const genre = await Genre.findByPk(req.params.id, {
            include: {
                model: Book,
            },
            order: [['name', 'ASC'], [Book, 'title', 'ASC']]
        });
        const text = JSON.stringify(genre);
        const json = JSON.parse(text);

        if(json === null) {
            const error = new Error('Genre not found');
            error.status = 404;
            return next(error);
        }
        
        res.render('genre_detail', {
            title: 'Genre Detail',
            json,
            genre_books: json.books
        });
    } catch(err){
        console.log('debbug: ' + err);
    }

};

// Display Genre create form on GET
exports.genre_create_get = async (req, res, next) => {
    res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST
// controller specifies an array of middleware functions. the array is passed to the router function and each method is called in order
exports.genre_create_post = [
    
    // Validate and sanitize the 'name' field
    body("name", "Genre name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),

    body("name", "Genre name must use letters")
        .isAlpha(),

    // Process request after validation and sanitization
    async (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data
        const genre = new Genre({ name: req.body.name });

        if(!errors.isEmpty()){
            // There are errors. Render the form again with sanitized values/error messages

            res.render("genre_form", {
                title: "Create Genre",
                genre,
                errors: errors.array(),
            });
            return;
        }

        // Data from is valid
        // Check if Genre with same name already exists
        const genreExists = await Genre.findOne({ 
            where: {
                name: req.body.name 
            }
        }); // I'm not worring about case-sensitivity here because mysql is defined to be accent-insensitive and case-insensitive
        
        if(genreExists){
            // Genre exists, redirect to its detail page
            res.redirect(genreExists.url);
            return;
        }

        // New genre. Save and redirect to its detail page
        await genre.save(); // Validates this instance, and if the validation passes, persists it to the database
        res.redirect(genre.url);
    }
];

// Display Genre delete form on GET
exports.genre_delete_get = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre delete GET");
};

// Handle Genre delete on POST
exports.genre_delete_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre delete POST");
};

// Display Genre update form on GET
exports.genre_update_get = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST
exports.genre_update_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre update POST");
};
