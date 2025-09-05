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

        // accessing a specific genre
        // it should list all books that belong to the accessed genre
        // also show each book summary

        const genre = await Genre.findByPk(1, {
            include: {
                model: Book,
            },
            order: [['name', 'ASC'], [Book, 'title', 'ASC']]
        });
        
        console.log("------------------------------------------");
        
        let text = JSON.stringify(genre);
        let json = JSON.parse(text);
        console.log(json);

        console.log("------------------------------------------");



        console.log("------------------------------------------");
    }
    catch (error) {
        console.error('Test failed:', error);
    }
}

testModels();
