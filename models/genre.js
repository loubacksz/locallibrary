const { DataTypes } = require('sequelize');
const database = require('../bin/www');

const Genre = database.define('genre',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [3,100]
        }
    },

}, {
    timestamps: false,
    freezeTableName: true,
});

module.exports = Genre;