const database = require('./bin/www');
const Author = require('./models/author');
const Book = require('./models/book');
const Genre = require('./models/genre');
const GenreBook = require('./models/genrebook');
const BookInstance = require('./models/bookinstance');
const associations = require('./models/associations')

async function testModels(){
    try {
        await database.sync({ drop: false });
        await associations();
        console.log("------------------------------------------");

        const author = await Author.create({
            first_name: 'J.K',
            family_name: 'Rolling',
        });

        console.log("------------------------------------------");

        console.log(author.id);

        console.log("------------------------------------------");

        const book = await Book.create({
            title: 'Harry Potter',
            summary: 'Wiches and Wizards',
            isbn: '563-1-34-148410-6',
            authorId: 2
        });

        console.log("------------------------------------------");

        console.log(book.id);

        console.log("------------------------------------------");

    }
    catch (error) {
        console.error('Test failed:', error);
    }
}

testModels();




