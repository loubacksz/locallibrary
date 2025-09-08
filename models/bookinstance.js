const { DataTypes } = require('sequelize');
const database = require('../db/dbConnection');
const { DateTime, Zone } = require("luxon");

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
            return `/catalog/bookinstance/${this.id}`;
        }
    },
    due_back_formatted: {
        type: DataTypes.VIRTUAL,
        get() {
            if (this.dueBack !== null) {
                return DateTime.fromISO(this.dueBack).toLocaleString(DateTime.DATE_MED);
            } else {
                return 'No due date!';
            }
        }
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = BookInstance;