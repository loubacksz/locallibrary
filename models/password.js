const { DataTypes } = require('sequelize');
const database = require('../db/dbConnection');

/* 
    database = sequelize variable from /db/dbConnection - it's the connection with the database
    the sequelize variable stores the Sequelize object that create the connection with the db

    relation -> user must have one password and a single password belogns to one user
*/

const Password = database.define('password', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    user_password: { 
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    user_salt: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = Password;