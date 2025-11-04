// now we are creating the controllers!

// first, we need to import the models - we'll later be using to access and update our data
const Book = require('../models/book');
const Author = require("../models/author");
const Genre = require("../models/genre");
const GenreBook = require('../models/genrebook');
const BookInstance = require("../models/bookinstance");
const associations = require('../models/associations');

// importing validation and sanitization methods
const { body, validationResult } = require('express-validator');
    // this is just a function call that returns an object, and we DESTRUCTURE the two properties, 'body' and 'validationResult', from the object, 
    // so we can use them as variables directly

// then exports functions for each of the URLs we wish to handle

// Load Associations
associations();

exports.index = async (req, res, next) => {
    // Get details of books, book instances, authors and genre counts (in parallel)

    const [
        numBooks,
        numBookInstances,
        numAvailableBookInstances,
        numAuthors,
        numGenres
    ] = await Promise.all([
        Book.findAndCountAll(),
        BookInstance.findAndCountAll(),
        BookInstance.findAndCountAll({where: {status: 'Available'}}),
        Author.findAndCountAll(),
        Genre.findAndCountAll()
    ]);

    res.render("index", {
        title: "Local Library Home",
        book_count: numBooks.count,
        book_instance_count: numBookInstances.count,
        book_instance_available_count: numAvailableBookInstances.count,
        author_count: numAuthors.count,
        genre_count: numGenres.count,
    });
};

// Display list of all books
exports.book_list = async (req, res, next) => {
    try{
        const allBooks = await Book.findAll(
            {
                include: {
                    model: Author,
                    attributes: ['first_name', 'family_name']
                },
                attributes: ['id','title', 'url'],
                order: [['title', 'ASC']],
            }
        );
        const string = JSON.stringify(allBooks, null, 2);
        const book = JSON.parse(string);

        res.render("book_list", { title: "Book List", book_list: book });
    } catch (err){
        console.log('debbug: ' + err);
    }
};

// Display detail page for a specific book
exports.book_detail = async (req, res, next) => {
    try{
        const bookDetail = await Book.findByPk(req.params.id, {
            include: [
                {
                    model: Author,
                    attributes: ['id', 'first_name', 'family_name', 'url']
                },
                {
                    model: Genre,
                },
                {
                    model: BookInstance,
                    attributes: {include: [['dueBack', 'due_back']]}
                }
            ],
            order: [['title', 'ASC']],
        });
        const book_text = JSON.stringify(bookDetail);
        const book = JSON.parse(book_text);

        if(book === null) {
            const error = new Error('Book not found');
            error.status = 404;
            return next(error);
        }

        res.render('book_detail', {
            book,
            book_instances: book.bookinstances
        });
    } catch(err){ 
        console.log('debbug: ' + err)
    }
};

// Display book create form on GET
exports.book_create_get = async (req, res, next) => {
    try{
        // Get all authors and genres, which we can use for adding to our book.
        const [allAuthorsRaw, allGenresRaw] = await Promise.all([
            Author.findAll({order: [['first_name', 'ASC']]}),
            Genre.findAll({
                order: [['name', 'ASC']]
            }),
        ]);
        const authorsTxt = JSON.stringify(allAuthorsRaw);
        const genresTxt = JSON.stringify(allGenresRaw);
        const allAuthors = JSON.parse(authorsTxt);
        const allGenres = JSON.parse(genresTxt);
    
        res.render("book_form", {title: "Create Book", authors: allAuthors, genres: allGenres});
    } catch(err){
        console.log('debbug: ' + err);
    }
};

// Handle book create on POST
exports.book_create_post = [
    // convert genre to an array
    (req, res, next) => {
        if(!Array.isArray(req.body.genre)){
            req.body.genre = 
                typeof req.body.genre === "undefined" ? [] : [req.body.genre];
        }
        next();
    },

    // validate and sanitize
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("author", "Author must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("summary", "Summary must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
    body("genre.*").escape(),
    
    // proccess request after v and s
    async (req, res, next) => {
        // extract validation errors from a request
        const errors = validationResult(req);

        // converting req.body.genre to number
        const genresArray = [];
        for (let i = 0; i < req.body.genre.length; i++) {
            genresArray[i] = Number(req.body.genre[i]);
        }
        req.body.genre = genresArray;

        // create a book with escaped and trimmed data
        // here we'll use the genrebook model | for each item on req.body.genre we'll create an instance on genrebook | first I create the book, then the genrebook
        const book = await Book.create({
            authorId: req.body.author,
            title: req.body.title,
            summary: req.body.summary,
            isbn: req.body.isbn
        });

        // create genrebook with escaped and trimmed data
        for (const genre of req.body.genre) {
            const genrebook = GenreBook.build({
                bookId: book.id,
                genreId: genre
            });
            await genrebook.save();
        }

        // search for created book
        const findBook = await Book.findByPk(book.dataValues.id, {include: [{model: Genre, attributes: ['id']}]});

        // check errors - all this is just to render the form again with the same values passed for the first time | if true - send to author.url with errors message
        // if false - save it to db and send to author.url
        if(!errors.isEmpty()){
            // Get all authors and genres for form
            const [allAuthorsRaw, allGenresRaw] = await Promise.all([
                Author.findAll({order: [['first_name', 'ASC']]}),
                Genre.findAll({order: [['name', 'ASC']]})
            ]);
            const authorsTxt = JSON.stringify(allAuthorsRaw);
            const allAuthors = JSON.parse(authorsTxt);

            const genresTxt = JSON.stringify(allGenresRaw);
            const allGenres = JSON.parse(genresTxt);

            // mark our selected genres as checked | here we're verifying if the genre array created above using the form is included on the Book object build above
            // if true - (i think)we create the 'checked' attribute and mark it as true | here we'll use the genrebook model
            for (const genre of allGenres) {
                if (findBook.genres.id = genre.id) {
                    genre.checked = "true";
                }
            }

            res.render("book_form", {
                title: "Create Book",
                authors: allAuthors,
                genres: allGenres,
                findBook,
                errors: errors.array(),
            });
            return;
        }

        res.redirect(book.url);
    }

]

// Display book delete form on GET
exports.book_delete_get = async (req, res, next) => {
    try{
        const bookRaw = await Book.findByPk(req.params.id, {
            include: [
                {
                    model: Author,
                    attributes: ['id', 'first_name', 'family_name', 'name', 'url']
                },
                {
                    model: Genre,
                },
                {
                    model: BookInstance,
                    attributes: { include: [['dueBack', 'due_back']] }
                }
            ],
            order: [['title', 'ASC']],
        });
        const book_text = JSON.stringify(bookRaw);
        const book = JSON.parse(book_text);
        
        if(book === null) {
            res.redirect("/catalog/books");
        }

        res.render("book_delete", {
            title: "Delete Book", 
            book: book,
            book_instances: book.bookinstances
        });
    } catch(err){
        console.log("debug: " + err);
    }
};

// Handle book delete on POST
exports.book_delete_post = async (req, res, next) => {
    try{
        const bookRaw = await Book.findByPk(req.params.id, {
            include: [
                {
                    model: Author,
                    attributes: ['id', 'first_name', 'family_name', 'name', 'url']
                },
                {
                    model: Genre,
                },
                {
                    model: BookInstance,
                    attributes: { include: [['dueBack', 'due_back']] }
                }
            ],
            order: [['title', 'ASC']],
        });
        const bookTxt = JSON.stringify(bookRaw);
        const book = JSON.parse(bookTxt);

        if(bookRaw === null){
            res.redirect("/catalog/books");
        }

        if(book.bookinstances.length > 0){
            res.render("book_delete", {
                title: "Delete Book",
                book: book,
                book_instances: book.bookinstances
            });
            return;
        }

        const destroy = await Book.destroy({
            where: {
                id: req.params.id
            }
        });

        if(destroy === 0){
            const error = new Error("Book not deleted!");
            error.status = 503
            return next(error);
        }

        res.redirect("/catalog/books")
    } catch(err){
        console.log("debug: " + err);
    }
}

// Display book update form on GET
exports.book_update_get = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST
exports.book_update_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Book update POST");
};