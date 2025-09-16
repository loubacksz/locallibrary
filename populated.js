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

        // accessing a specific book instance -> findByPk()
        // book instance id
        // book instance due back
        // book instance imprint
        // book instance status
        // book title

        const bookInstanceDetail = await BookInstance.findByPk(1, {
            include: {
                model: Book,
                attributes: ['id', 'title', 'url']
            },
            attributes: { exclude: ['bookId'] },
        });
        
        console.log("------------------------------------------");
        
        const text1 = JSON.stringify(bookInstanceDetail);
        const json1 = JSON.parse(text1);
        console.log(json1);

        console.log("------------------------------------------");



        console.log("------------------------------------------");
    }
    catch (error) {
        console.error('debbug: ', error);
    }
}

testModels();
