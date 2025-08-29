const { DataTypes } = require('sequelize');
const database = require('../db/dbConnection');

const Book = database.define('book', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    summary: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isbn: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.VIRTUAL,
        get() {
            return `/catalog/book/${this._id}`;
        }
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = Book;