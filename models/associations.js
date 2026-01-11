const database = require('../db/dbConnection');
const Author = require('./author');
const Book = require('./book');
const Genre = require('./genre');
const GenreBook = require('./genrebook');
const BookInstance = require('./bookinstance');
const Role = require('./role');
const User = require('./user');

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

    // defining only a customized FK might generate duplicated columns - so it better use an ALIAS
    Role.hasMany(User, { as: 'assigned', foreignKey: {name:'role_id', allowNull: false} });
    User.belongsTo(Role, { as: 'is', foreignKey: {name:'role_id', allowNull: false} });
}

module.exports = modelAssociations;