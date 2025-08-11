const { DataTypes } = require('sequelize');
const database = require('../bin/www');

/* 
database = sequelize variable from /bin/www.js - it's the connection with the database
the sequelize variable stores the Sequelize object that create the connection with the db
*/

const Author = database.define('author', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    first_name: { 
        type: DataTypes.STRING(100),
        allowNull: false,
        maxLength: 100 
    },
    family_name: { 
        type: DataTypes.STRING(100), 
        allowNull: false, 
    },
    date_of_birth: DataTypes.DATEONLY,
    date_of_death: DataTypes.DATEONLY
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = Author;