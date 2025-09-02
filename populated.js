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
        //await database.sync({alter: {drop: false}}); - no need to sync every time, this will only change the tables

        // list of all authors
        // with each author name linked to its associated author detail page
        // date of birth and date of death should be listed after the name on the same line

        const author = await Author.findAll();
        console.log("------------------------------------------");
        
        let text = JSON.stringify(author);
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
