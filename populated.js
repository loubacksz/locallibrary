const database = require('./db/dbConnection');
const Author = require('./models/author');
const Book = require('./models/book');
const Genre = require('./models/genre');
const GenreBook = require('./models/genrebook');
const BookInstance = require('./models/bookinstance');
const associations = require('./models/associations');

async function testModels(){
    try {
        associations(); //it's necessary to call the associations before making CRUD
        //await database.sync({alter: {drop: false}}); //- no need to sync every time, this will only change the tables

        // remember to ALWAYS use the 'length' property when checking the size of an array

        const [getBookRaw] = await Promise.all([
            Book.findByPk(23, { include: [{ model: Genre }, { model: Author }] }),
        ])
        const bookTxt = JSON.stringify(getBookRaw);
        const book = JSON.parse(bookTxt);

        console.log("------------------------------------------");

        console.log(book.genres)

        console.log("------------------------------------------");

        console.log();

        console.log("------------------------------------------");
    }
    catch (error) {
        console.error('debbug: ', error);
    }
}

testModels();