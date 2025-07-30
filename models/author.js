const {Sequelize, DataTypes} = require('sequelize');

// database = sequelize from /app - it's the connection with the database
const database = require('../app');

const Author = database.define('Author', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
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
    date_of_death: DataTypes.DATEONLY ,

});

module.exports = Author;