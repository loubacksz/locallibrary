const database = require('./bin/www');
const Author = require('./models/author');
const Book = require('./models/book');
const Genre = require('./models/genre');
const GenreBook = require('./models/genrebook');
const BookInstance = require('./models/bookinstance');
const associations = require('./models/associations')

async function testModels(){
    try {
        await associations();
    }
    catch (error) {
        console.error('Test failed:', error);
    } finally {
        await database.close();
    }
}

testModels();




