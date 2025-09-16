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

/*
    HTML Form - a group of one or more fields/widgets on a web page that can be used to collect information from users for submission to a server.
        is defined in HTML as a collection of elements inside <form>…</form> tags, containing at least one 'input' element of type="submit"
        The field's 'type' attribute defines what sort of widget will be displayed
        The form attributes define the HTTP method used to send the data and the destination of the data on the server (action)
        Often form handling code is implemented using a GET route for the initial display of the form and a POST route to the same path for handling validation and processing of form data

    Form Validation and Sanitization
        Validation checks that entered values are appropriate for each field (are in the right range, format, etc.) and that values have been supplied for all required fields.
        Sanitization removes/replaces characters in the data that might potentially be used to send malicious content to the server.


    cross-site forgery request attacks
*/