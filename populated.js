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

        // this is the difference between res.send() and res.render()
        // res.send() - sends the HTTP response
        // res.render() - renders a view and sends the rendered HTML string to the client

        const authorRaw = await Author.destroy({
            where: {
                id: 3
            }
        });
        const authorTxt = JSON.stringify(authorRaw);
        const author = JSON.parse(authorTxt);

        console.log("------------------------------------------");

        console.log(authorRaw)

        console.log("------------------------------------------");

        console.log(author)

        console.log("------------------------------------------");
    }
    catch (error) {
        console.error('debbug: ', error);
    }
}

testModels();