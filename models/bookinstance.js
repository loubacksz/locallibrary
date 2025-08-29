const { DataTypes } = require('sequelize');
//const database = require('../bin/www');
const database = require('../db/dbConnection');

//I have to use ENUM here, although it appears on the documentation
//that it can only be used with Postgres, that's not true  

const BookInstance = database.define('bookinstance', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    imprint: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(['Available', 'Maintenance', 'Loaned', 'Reserved']),
        allowNull: false,
        defaultValue: 'Maintenance'
    },
    dueBack: {
        type: DataTypes.DATEONLY,
    },
    url: {
        type: DataTypes.VIRTUAL,
        get() {
            return `/catalog/bookinstance/${this._id}`;
        }
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = BookInstance;