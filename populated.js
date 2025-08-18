/*
const database = require('./bin/www');
const Author = require('./models/author');
const Book = require('./models/book');
const Genre = require('./models/genre');
const GenreBook = require('./models/genrebook');
const BookInstance = require('./models/bookinstance');
const associations = require('./models/associations')

async function testModels(){
    try {
        await associations(); //it's necessary to call the associations before making CRUD
        
        //await database.sync(); - no need to sync every time, this will only change the tables

        const genrebook = await GenreBook.create({
            genreId: 1,
            bookId: 1
        });

        console.log("------------------------------------------");

        console.log(genrebook.id);

        console.log("------------------------------------------");

    }
    catch (error) {
        console.error('Test failed:', error);
    }
}

testModels();
*/



