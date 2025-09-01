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

        // list of all book copies
        // title of the Book associated with each BookInstance(linked with its detail page) 
        // status, imprint, id of each copy
        // the unique id text should be linked to the BookInstance detail page

        const bookInstance = await BookInstance.findAll({
            include: {
                model: Book,
                attributes: ['title'],
            },
            attributes: {
                include:[['dueBack', 'due_back']]
            }
        });

        console.log("------------------------------------------");
        
        let text = JSON.stringify(bookInstance);
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
