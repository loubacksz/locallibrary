// now we are creating the controllers! 

// first we need to import the modules - we'll later be using to access and update our data
const Book = require('../models/book');
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const associations = require('../models/associations');

// then exports functions for each of the URLs we wish to handle

// Display list of all Authors.
exports.author_list = async (req, res, next) => {
    try {
        await associations();

        const allAuthors = await Author.findAll();
    
        res.render('author_list', {
        title: "Author List",
        author_list: allAuthors,
        });
    } catch(err){
        console.log('debbug: ' + err);
    }
};

// Display detail page for a specific Author.
exports.author_detail = async (req, res, next) => {
    try{
        await associations();
        
        const authorDetail = await Author.findByPk(req.params.id, {
            include: [
                {
                    model: Book,
                },
            ],
            order: [['first_name', 'ASC']],
        });
        const txt = JSON.stringify(authorDetail);
        const author = JSON.parse(txt);

        if(author === null){
            const error = new Error('Author not found');
            error.status = 404;
            return next(error);
        }

        res.render('author_detail',{
            author,
            author_books: author.books
        });
    } catch(err){
        console.log('debbug: ' + err);
    }
};

// Display Auhtor create form on GET.
exports.author_create_get = async (req, res, next) => { 
    res.send("NOT IMPLEMENTED: Author create GET");
};

// Handle Author create on POST
exports.author_create_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author create POST");
};

// Display Author delete form on GET
exports.author_delete_get = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete GET");
};

// Handle Author delete POST
exports.author_delete_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete POST");
};

// Display Author update form on GET
exports.author_update_get = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST
exports.author_update_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update POST");
};