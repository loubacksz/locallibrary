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

        // accessing a specific author -> findByPk()
        // author name
        // author date_of_birth
        // author date_of_death
        // author books
        // list ALL author books and its properties -> findAll()
            // need to find WHERE Author model 'author.id' = Book model 'book.id'

        const bookDetail = await Author.findByPk(1, {
            include: [
                {
                    model: Book,
                },
            ],
            order: [['first_name', 'ASC']],
        });
        
        console.log("------------------------------------------");
        
        const text1 = JSON.stringify(bookDetail);
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
