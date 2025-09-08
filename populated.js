const database = require('./db/dbConnection');
const Author = require('./models/author');
const Book = require('./models/book');
const Genre = require('./models/genre');
const GenreBook = require('./models/genrebook');
const BookInstance = require('./models/bookinstance');
const associations = require('./models/associations');

async function testModels(){
    try {
        await associations(); //it's necessary to call the associations before making CRUD
        // await database.sync({alter: {drop: false}}); //- no need to sync every time, this will only change the tables

        // accessing a specific book -> findByPk()
        // book name
        // book author
        // book summary
        // book isbn
        // list ALL instances of a book and its properties -> findAll()
            // need to find WHERE Book model 'book.id' = BookInstance model 'bookinstance.bookId'

        const bookDetail = await Book.findByPk(1, {
            include: [
                {
                    model: Author,
                    attributes: ['first_name', 'family_name', 'url']
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
        
        console.log("------------------------------------------");
        
        const text1 = JSON.stringify(bookDetail);
        const json1 = JSON.parse(text1);
        console.log(json1);

        console.log("------------------------------------------");



        console.log("------------------------------------------");
    }
    catch (error) {
        console.error('debbug: ', error);
    }
}

testModels();
