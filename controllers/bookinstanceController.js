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

// Display list of all BookInstances.
exports.bookinstance_list = async (req, res, next) => {
    try {
        const allBookInstances = await BookInstance.findAll({
            include: {
                model: Book,
                attributes: ['title'],
            },
            attributes: {
                include: [['dueBack', 'due_back']]
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
    } catch (err) {
        console.log('debbug: ' + err);
    }
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = async (req, res, next) => {
    try {
        const bookInstanceDetail = await BookInstance.findByPk(req.params.id, {
            include: {
                model: Book,
                attributes: ['id', 'title', 'url']
            },
            attributes: { exclude: ['bookId'] },
        });
        const text = JSON.stringify(bookInstanceDetail);
        const bookinstance = JSON.parse(text);

        if (bookinstance === null) {
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
    try {
        // Get all authors and genres, which we can use for adding to our book.
        const allBooksRaw = await Book.findAll({ order: [['title', 'ASC']] });
        const bookTxt = JSON.stringify(allBooksRaw);
        const allBooks = JSON.parse(bookTxt);

        res.render("bookinstance_form", { title: "Create Book Instance", book_list: allBooks });
    } catch (err) {
        console.log('debbug: ' + err);
    }
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    // v and s
    body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
    body("imprint", "Imprint must be specified")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("status").escape(),
    body("due_back", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601(),

    // proccess request after v and s - this is making the request work properly
    async (req, res, next) => {
        try {
            // extract validation errors from a request
            const errors = validationResult(req);

            // create a bookinstance with escaped and trimmed data
            const bookinstance = BookInstance.build({
                imprint: req.body.imprint,
                status: req.body.status,
                dueBack: req.body.due_back,
                bookId: req.body.book
            });

            // check for errors
            if (!errors.isEmpty()) {
                // i can make this a function
                const allBooksRaw = await Book.findAll({ order: [['title', 'ASC']] });
                const bookTxt = JSON.stringify(allBooksRaw);
                const allBooks = JSON.parse(bookTxt);

                res.render('bookinstance_form', {
                    title: 'Create Book Instance',
                    book_list: allBooks,
                    selected_book: bookinstance.bookId,
                    bookinstance: bookinstance,
                    errors: errors.array()
                });
                return;
            }

            await bookinstance.save();
            res.redirect(bookinstance.url);
        }
        catch (err) {
            console.log("debbug: " + err);
            console.log(req.body);
        }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = async (req, res, next) => {
    try {
        const bookinstanceRaw = await BookInstance.findByPk(req.params.id, {
            include: {
                model: Book
            }
        });
        const bookinstanceTxt = JSON.stringify(bookinstanceRaw);
        const bookinstance = JSON.parse(bookinstanceTxt);

        if (bookinstanceRaw === null) {
            res.redirect("/catalog/bookinstances");
        }

        res.render("bookinstance_delete", {
            title: "Delete Bookinstance",
            bookinstance: bookinstance
        });
    } catch (err) {
        console.log("debug: " + err);
    }
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = async (req, res, next) => {
    try {
        const bookinstanceRaw = await BookInstance.destroy({
            where: {
                id: req.params.id
            }
        });

        if (bookinstanceRaw === 0) {
            // no rows delelte in the database
            const getbookinstanceRaw = await BookInstance.findByPk(req.params.id, {
                include: {
                    model: Book
                }
            });
            const bookinstanceTxt = JSON.stringify(getbookinstanceRaw);
            const bookinstance = JSON.parse(bookinstanceTxt);

            res.render("bookinstance_delete", {
                title: "Delete Bookinstance",
                bookinstance: bookinstance,
                deleted: 0
            });
        }

        res.redirect("/catalog/bookinstances");
    } catch (err) {
        console.log("debug: " + err);
    }
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = async (req, res, next) => {
    try {
        const [bookInstanceRaw, bookRaw] = await Promise.all([
            BookInstance.findByPk(req.params.id, {
                include: {
                    model: Book,
                    attributes: ['id', 'title', 'url']
                },
                attributes: { exclude: ['bookId'] },
            }),
            Book.findAll({ order: [['title', 'ASC']] })
        ]);
        const bookinstanceTxt = JSON.stringify(bookInstanceRaw);
        const bookinstance = JSON.parse(bookinstanceTxt);

        res.render("bookinstance_form", {
            title: "Update Book Instance",
            book_list: bookRaw,
            selected_book: bookinstance.book.id,
            bookinstance: bookinstance,

        });
    } catch (err) {
        console.log("debug: " + err);
    }
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
    // v and s
    body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
    body("imprint", "Imprint must be specified")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("status").escape(),
    body("due_back", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601(),

    // proccess request after v and s - this is making the request work properly
    async (req, res, next) => {
        try {
            // extract validation errors from a request
            const errors = validationResult(req);

            // check for errors
            if (!errors.isEmpty()) {
                // i can make this a function
                const allBooksRaw = await Book.findAll({ order: [['title', 'ASC']] });
                const bookTxt = JSON.stringify(allBooksRaw);
                const allBooks = JSON.parse(bookTxt);

                res.render('bookinstance_form', {
                    title: 'Create Book Instance',
                    book_list: allBooks,
                    selected_book: bookinstance.bookId,
                    bookinstance: bookinstance,
                    errors: errors.array()
                });
                return;
            }

            if (req.body.due_back === '') {
                req.body.due_back = null;
            }

            const getbookinstanceRaw = await BookInstance.findByPk(req.params.id);
            const bookinstanceTxt = JSON.stringify(getbookinstanceRaw);
            const bookinstance = JSON.parse(bookinstanceTxt);

            await BookInstance.update({
                imprint: req.body.imprint,
                status: req.body.status,
                dueBack: req.body.due_back,
                bookId: req.body.book
            },
                { where: { id: req.params.id } }
            );

            res.redirect(bookinstance.url);
        }
        catch (err) {
            console.log("debbug: " + err);
        }
    }
];
