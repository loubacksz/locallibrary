const { DataTypes } = require('sequelize');
const database = require('../bin/www');
//const Book = require('./book');
//const GenreBook = require('./genrebook');

const Genre = database.define('genre',{
    genreId:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [3,100]
        }
    },

}, {
    timestamps: false,
    freezeTableName: true,
});

module.exports = Genre;
/*
database.sync({alter: true});

Genre.belongsToMany(Book, {through: GenreBook});
Book.belongsToMany(Genre, {through: GenreBook});
*/