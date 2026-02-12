const { DataTypes } = require('sequelize');
const database = require('../db/dbConnection');
const { DateTime } = require("luxon");

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
    date_of_death: DataTypes.DATEONLY,
    birth_date_formatted: {
        type: DataTypes.VIRTUAL,
        get() {
            if (this.date_of_birth !== null) {
                return DateTime.fromISO(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
            } else {
                return 'No birth date!';
            }
        }
    },
    death_date_formatted: {
        type: DataTypes.VIRTUAL,
        get() {
            if (this.date_of_death !== null) {
                return DateTime.fromISO(this.date_of_death).toLocaleString(DateTime.DATE_MED);
            } else {
                return 'No death date!';
            }
        }
    },
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = Author;