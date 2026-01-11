const { DataTypes } = require('sequelize');
const database = require('../db/dbConnection');

/* 
    database = sequelize variable from /db/dbConnection - it's the connection with the database
    the sequelize variable stores the Sequelize object that create the connection with the db

    relation -> user must have one role and a single role can be defined for many users
*/

const User = database.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_name: { 
        type: DataTypes.STRING(100),
        allowNull: false,
        maxLength: 100 
    },
    user_email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        maxLength: 100 
    },
    user_password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        maxLength: 100 
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = User;