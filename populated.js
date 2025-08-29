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
        // await database.sync(); - no need to sync every time, this will only change the tables

        // I want to request a "new table" with only 'book.title' and 'author.first_name'/'author.family_name' -> this means JOINS -> EAGER LOADING
        
        // return a list with all 'book' instances -> findAll() ✅
        // return a list with all 'book' instances with only the 'title' colum -> findAll({attributes: []}) ✅
        
        // replace the stored 'book.authorId' with the full author details -> findAll({include: {}}) ✅
        //   return the author first_name ✅
        //   return the author family_name ✅

        // sort the results by the title alphabetically -> findAll({order: []}) ✅

        const book = await Book.findAll( //query all books - need to make this request only return the title and author name and sort the titles
            {
                include: {
                    model: Author,
                    attributes: [['first_name', 'name'], 'family_name']
                },
                attributes: ['title'],
                order: [['title', 'ASC']],
                //raw: true
            }
        );

        console.log("------------------------------------------");
        
        console.log(book);

        console.log("------------------------------------------");

        
        let test = JSON.stringify(book, null, 2);
        
        let result = JSON.parse(test);
        
        console.log(result);

        console.log("------------------------------------------");
    }
    catch (error) {
        console.error('Test failed:', error);
    }
}

testModels();
