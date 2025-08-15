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

        /*const genre = await Genre.create({
            name: 'Fantasy',
        });

        console.log("------------------------------------------");

        console.log(genre.id);

        console.log("------------------------------------------");*/

        const bookinstance = await BookInstance.create({
            bookId: 2,
            imprint: 'Naughty Books',
            dueBack: new Date(),
            status: 'Available'
        });

        console.log("------------------------------------------");

        console.log(bookinstance.id);

        console.log("------------------------------------------");

    }
    catch (error) {
        console.error('Test failed:', error);
    }
}

testModels();




