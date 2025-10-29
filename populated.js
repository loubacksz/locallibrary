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

        // this is the difference between res.send() and res.render()
        // res.send() - sends the HTTP response
        // res.render() - renders a view and sends the rendered HTML string to the client

        const bookRaw = await Book.destroy({
            where: {
                id: 44
            }
        });
        const book_text = JSON.stringify(bookRaw);
        const book = JSON.parse(book_text);

        console.log("------------------------------------------");

        console.log(bookRaw)

        console.log("------------------------------------------");

        console.log(book)

        console.log("------------------------------------------");
    }
    catch (error) {
        console.error('debbug: ', error);
    }
}

testModels();