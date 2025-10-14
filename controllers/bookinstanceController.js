// now we are creating the controllers! 

// first we need to import the modules - we'll later be using to access and update our data
const Book = require('../models/book');
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const associations = require('../models/associations');

// importing validation and sanitization methods
const { body, validationResult } = require('express-validator');

// then exports functions for each of the URLs we wish to handle

// Display list of all BookInstances.
exports.bookinstance_list = async (req, res, next) => {
    try{
        await associations();

        const allBookInstances = await BookInstance.findAll({
            include: {
                model: Book,
                attributes: ['title'],
            },
            attributes: {
                include:[['dueBack', 'due_back']]
            },
            order: [[Book, 'title', 'ASC']]
        });
        let string = JSON.stringify(allBookInstances);
        let json = JSON.parse(string);

        res.render(
            "bookinstance_list", {
            title: "Book Instance List",
            bookinstance_list: json,
        });
    } catch(err){
        console.log('debbug: ' + err);
    }
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = async (req, res, next) => {
    try {
        await associations();

        const bookInstanceDetail = await BookInstance.findByPk(req.params.id, {
            include: {
                model: Book,
                attributes: ['id', 'title', 'url']
            },
            attributes: { exclude: ['bookId'] },
        });
        const text = JSON.stringify(bookInstanceDetail);
        const bookinstance = JSON.parse(text);

        if(bookinstance === null){
            const error = new Error('Book Instance not found!');
            error.status = 404;
            return error.status;
        }

        res.render('bookinstance_detail', {
            bookinstance
        });
    } catch (err) {
        console.log('debbug: ' + err);
    }
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = async (req, res, next) => {
    try{
        // Get all authors and genres, which we can use for adding to our book.
        const allBooksRaw = await Book.findAll({ order: [['title', 'ASC']] });
        const bookTxt = JSON.stringify(allBooksRaw);
        const allBooks = JSON.parse(bookTxt);
    
        res.render("bookinstance_form", {title: "Create Book Instance", book_list: allBooks});
    } catch(err){
        console.log('debbug: ' + err);
    }
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance create POST");
};

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance delete GET");
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance delete POST");
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance update GET");
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance update POST");
};
