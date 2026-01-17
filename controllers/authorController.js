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

// Display list of all Authors.
exports.author_list = async (req, res, next) => {
    try {
        const allAuthors = await Author.findAll();

        res.render('author_list', {
            title: "Author List",
            author_list: allAuthors,
        });
    } catch (err) {
        console.log('debbug: ' + err);
    }
};

// Display detail page for a specific Author.
exports.author_detail = async (req, res, next) => {
    try {
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

        if (author === null) {
            const error = new Error('Author not found');
            error.status = 404;
            return next(error);
        }

        res.render('author_detail', {
            author,
            author_books: author.books
        });
    } catch (err) {
        console.log('debbug: ' + err);
    }
};

// Display Author create form on GET.
exports.author_create_get = async (req, res, next) => {
    res.render("author_form", { title: "Create Author" });
};

// Handle Author create on POST
exports.author_create_post = [
    // validation and sanitization - each field has it own validation/sanitization
    body('first_name', "Test")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified."),
    body('family_name', "Name must use letters")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Family name must be specified."),
    body("date_of_birth", "Invalid date of birth")
        .optional({ values: "falsy" })
        .isISO8601(),
    body("date_of_death", "Invalid date of death")
        .optional({ values: "falsy" })
        .isISO8601(),

    // process the request after v and s
    async (req, res, next) => {
        try {
            // extract validation errors from a request
            const errors = validationResult(req);

            // what if I don't have a date_of_birth
            if (req.body.date_of_birth === '') {
                req.body.date_of_birth = null;
            }

            // what if I don't have a date_of_death
            if (req.body.date_of_death === '') {
                req.body.date_of_death = null;
            }

            // create author object with escaped and trimmed data - use 'build' instead of 'create' - build does not persist when its called
            const author = Author.build({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });

            // check errors
            // if true - send to author.url with errors message
            // if false - save it to db and send to author.url
            if (!errors.isEmpty()) {
                res.render("author_form", {
                    title: "Create Author",
                    errors: errors.array() // returns a list of all errors from all validated fields
                });
                return;
            }

            await author.save();
            res.redirect(author.url);
        } catch (err) {
            console.log('debug: ' + err);
        }
    }
];

// Display Author delete form on GET
exports.author_delete_get = async (req, res, next) => {
    try {
        const authorRaw = await Author.findByPk(req.params.id, {
            include: [
                {
                    model: Book,
                },
            ],
            order: [['first_name', 'ASC']],
        });
        const authorTxt = JSON.stringify(authorRaw);
        const author = JSON.parse(authorTxt);

        if (author === null) {
            res.redirect('/catalog/authors');
            return;
        }

        res.render("author_delete", {
            title: "Delete Author",
            author: author,
            author_books: author.books
        });
    }
    catch (err) {
        console.log('debbug: ' + err);
    }

};

// Handle Author delete POST
exports.author_delete_post = async (req, res, next) => {
    try {
        const authorRaw = await Author.findByPk(req.params.id, {
            include: [
                {
                    model: Book,
                },
            ],
            order: [['first_name', 'ASC']],
        });
        const authorTxt = JSON.stringify(authorRaw);
        const author = JSON.parse(authorTxt);

        if (author.books.length > 0) {
            res.render("author_delete", {
                title: "Delete Author",
                author: author,
                author_books: author.books
            });
            return;
        }

        const destroy = await Author.destroy({
            where: {
                id: req.params.id
            }
        });

        if (destroy === 0) {
            const error = new Error("Book not deleted!");
            error.status = 503
            return next(error);
        }

        res.redirect("/catalog/authors");
    } catch (err) {
        console.log('debug: ' + err);
    }
};

// Display Author update form on GET
exports.author_update_get = async (req, res, next) => {
    try {
        const authorRaw = await Author.findByPk(req.params.id);
        const authorTxt = JSON.stringify(authorRaw);
        const author = JSON.parse(authorTxt);

        res.render('author_form', {
            title: "Update Author",
            author: author,
        });
    } catch (err) {
        console.log('debug: ' + err);
    }
};

// Handle Author update on POST
exports.author_update_post = [
    // validation and sanitization - each field has it own validation/sanitization
    body('first_name', "Test")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified."),
    body('family_name', "Name must use letters")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Family name must be specified."),
    body("date_of_birth", "Invalid date of birth")
        .optional({ values: "falsy" })
        .isISO8601(),
    body("date_of_death", "Invalid date of death")
        .optional({ values: "falsy" })
        .isISO8601(),

    // process the request after v and s
    async (req, res, next) => {
        try {
            // extract validation errors from a request
            const errors = validationResult(req);

            // what if I don't have a date_of_birth
            if (req.body.date_of_birth === '') {
                req.body.date_of_birth = null;
            }

            // what if I don't have a date_of_death
            if (req.body.date_of_death === '') {
                req.body.date_of_death = null;
            }

            // check errors
            // if true - send to author.url with errors message
            // if false - save it to db and send to author.url
            if (!errors.isEmpty()) {
                res.render("author_form", {
                    title: "Create Author",
                    errors: errors.array() // returns a list of all errors from all validated fields
                });
                return;
            }

            const authorRaw = await Author.findByPk(req.params.id);
            const authorTxt = JSON.stringify(authorRaw);
            const author = JSON.parse(authorTxt);

            Author.update({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            },
                {
                    where: {
                        id: req.params.id
                    }
                }
            );

            res.redirect(author.url);
        } catch (err) {
            console.log('debug: ' + err);
        }
    }
];