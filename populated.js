const database = require('./bin/www');
const { Sequelize } = require('sequelize');

const Author = require('./models/author');
const Book = require('./models/book');
const Genre = require('./models/genre');
const GenreBook = require('./models/genrebook');
const BookInstance = require('./models/bookinstance');

async function testModelAuthor(){
    try {
        await database.sync({ alter: true });
        console.log('Database synced!');

        const author = await Author.create({
            first_name: 'luis guilherme',
            family_name: 'louback',
            date_of_birth: new Date(),
            date_of_death: new Date(),
        });

    }
    catch (error) {
        console.error('Test failed:', error);
    } finally {
        await database.close();
    }
}

async function testModelBook(){

    //inserting into the database - it'll take some time (asynchronous)
    //sync with the databese
    //do the sql
    //close the connection

    try{
        await database.sync({alter: true});
        console.log('----------------- Database synched!')

        const book = await Book.create({
            title: 'How to Train Your Dragon',
            summary: 'Training your dragon 🐉',
            isbn: 'idk'
        });

    } catch(error){
        console.error('------- ' + error);
    } finally{
        database.close();
    }

}

//testModelAuthor();

//testModelBook();

//already have the date - 
//it's coming from a form or something like that

async function dropTest() {

    try {
        await database.sync();
        await database.drop();
    } catch (err) {
        console.log(err);
    } finally {
        database.close();
        console.log('connection closed!')
    }
}
//dropTest();

// ASSOCIATION - ONE TO MANY
// COMBINATION OF: hasMany() and belongsTo()

database.sync({alter: true});

Genre.belongsToMany(Book, {
    through: GenreBook, 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE'
});

Book.belongsToMany(Genre, {
    through: GenreBook, 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE'
});

Author.hasMany(Book, {
    foreignKey: {
        name: 'authorId',
        allowNull: false
    }
});
Book.belongsTo(Author);

Book.hasMany(BookInstance, {
    foreignKey: {
        name: 'bookId',
        allowNull: false
    }
});
BookInstance.belongsTo(Book);





