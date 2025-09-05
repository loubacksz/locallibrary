// now we are creating the controllers! 

// first we need to import the modules - we'll later be using to access and update our data
const Book = require('../models/book');
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const associations = require('../models/associations');

// then exports functions for each of the URLs we wish to handle

// Display list of all Genre
exports.genre_list = async (req, res, next) => {
    try{
        await associations();

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
        await associations();

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
    res.send("NOT IMPLEMENTED: Genre create GET");
};

// Handle Genre create on POST
exports.genre_create_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre create POST");
};

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
