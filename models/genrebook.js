const { DataTypes } = require('sequelize');
const database = require('../bin/www')
const Book = require('./book');
const Genre = require('./genre');

const GenreBook = database.define('genrebook', {
    genreBookId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    genreId: {
        type: DataTypes.INTEGER,
        references: {
            model: Genre,
            key: 'genreId'
        }
    },
    bookId: {
        type: DataTypes.INTEGER,
        references: {
            model: Book,
            key: 'bookId'
        }
    }
});

module.exports = GenreBook;