const { DataTypes } = require('sequelize');
const database = require('../db/dbConnection');

/* 
    database = sequelize variable from /db/dbConnection - it's the connection with the database
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
    url: {
        type: DataTypes.VIRTUAL,
        get() {
            return `/catalog/author/${this.id}`;
        }
    },
    name: {
        type: DataTypes.VIRTUAL,
        get() {
            const name = this.first_name + ' ' + this.family_name;
            return name;
        }
    },
    date_of_birth: DataTypes.DATEONLY,
    date_of_death: DataTypes.DATEONLY
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = Author;