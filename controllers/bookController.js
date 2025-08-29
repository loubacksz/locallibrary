// now we are creating the controllers!

// first, we need to import the models - we'll later be using to access and update our data
const Book = require('../models/book');
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const associations = require('../models/associations');

// then exports functions for each of the URLs we wish to handle

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
        await associations();

        const allBooks = await Book.findAll(
            {
                include: {
                    model: Author,
                    attributes: ['first_name', 'family_name']
                },
                attributes: ['title'],
                order: [['title', 'ASC']],
            }
        );

        let string = JSON.stringify(allBooks, null, 2);

        let json = JSON.parse(string);

        res.render("book_list", { title: "Book List", book_list: json });
    } catch (err) {
        console.log('debbug: ' + err);
    }
};

// Display detail page for a specific book
exports.book_detail = async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`)
};

// Display book create form on GET
exports.book_create_get = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Book create GET");
};

// Handle book create on POST
exports.book_create_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Book create POST");
};

// Display book delete form on GET
exports.book_delete_get = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST
exports.book_delete_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET
exports.book_update_get = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST
exports.book_update_post = async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Book update POST");
};