const { DataTypes } = require('sequelize');
const database = require('../bin/www');

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
        type: DataTypes.STRING,
        allowNull: false,
        enum: ["Available", "Maintenance", "Loaned", "Reserved"],
        defaultValue: 'Maintenance'
    },
    dueBack: {
        type: DataTypes.DATEONLY,
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = BookInstance;