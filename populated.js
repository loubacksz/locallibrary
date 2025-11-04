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

        const getGenreRaw = await Genre.findByPk(2, {
            include: {
                model: Book,
            },
            order: [['name', 'ASC'], [Book, 'title', 'ASC']]
        });
        const genreTxt = JSON.stringify(getGenreRaw);
        const genre = JSON.parse(genreTxt);

        console.log("test")
        if (getGenreRaw.books.length > 0){
            console.log(true);
        }

        console.log("------------------------------------------");

        console.log(getGenreRaw.books.length > 0)

        console.log("------------------------------------------");

        console.log(genre.books.length);

        console.log("------------------------------------------");
    }
    catch (error) {
        console.error('debbug: ', error);
    }
}

testModels();