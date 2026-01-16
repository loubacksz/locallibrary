const database = require('../db/dbConnection');
const Author = require('./author');
const Book = require('./book');
const Genre = require('./genre');
const GenreBook = require('./genrebook');
const BookInstance = require('./bookinstance');
const Role = require('./role');
const User = require('./user');
const Password = require('./password');

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

    // defining only a customized FK might generate duplicated columns - so its better use an ALIAS - DEPRACATED
    // the problem is not the FK or using an ALIAS, the problem is not specifying the FK in both functions
    Role.hasMany(User, { foreignKey: {name:'role_id', allowNull: false} });
    User.belongsTo(Role, { foreignKey: 'role_id'});

    // always specify the FK column in both functions
    User.hasOne(Password, { foreignKey: { name: 'user_id', allowNull: false } });
    Password.belongsTo(User, { foreignKey:'user_id' });
}

module.exports = modelAssociations;