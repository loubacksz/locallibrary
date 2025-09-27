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
        //await database.sync({alter: {drop: false}}); //- no need to sync every time, this will only change the tables
        
        /*const genre = [1, 2, 7]

        const book = Book.build({
            authorId: 13,
            title: 'test',
            summary: 'test',
            isbn: 'test',
            genre: genre,
        });

        await book.save();*/

        const book = await Book.findByPk(27, {
            include: [{model: Genre, attributes: ['id']}]
        });

        const bookTxt = JSON.stringify(book);
        const bookRes = JSON.parse(bookTxt);
        
        console.log("------------------------------------------");

        console.log(bookRes)

        console.log("------------------------------------------");



        console.log("------------------------------------------");
    }
    catch (error) {
        console.error('debbug: ', error);
    }
}

testModels();