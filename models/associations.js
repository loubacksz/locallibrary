const database = require('../db/dbConnection');
const Author = require('./author');
const Book = require('./book');
const Genre = require('./genre');
const GenreBook = require('./genrebook');
const BookInstance = require('./bookinstance');

// a problem with this file is that i can't call for only one association 

const modelAssociations = function modelAssociations() {

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

}

module.exports = modelAssociations;