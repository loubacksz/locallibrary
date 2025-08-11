const { DataTypes } = require('sequelize');
const database = require('../bin/www')
const Book = require('./book');
const Genre = require('./genre');

const GenreBook = database.define('genrebooks', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    genreId: {
        type: DataTypes.INTEGER,
        references: {
            model: Genre,
            key: 'id',
        }
    },
    bookId: {
        type: DataTypes.INTEGER,
        references: {
            model: Book,
            key: 'id',
        }
    },
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = GenreBook;