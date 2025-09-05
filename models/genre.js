const { DataTypes } = require('sequelize');
const database = require('../db/dbConnection');

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
    url: {
        type: DataTypes.VIRTUAL,
        get() {
            return `/catalog/genre/${this.id}`;
        }
    }
}, {
    timestamps: false,
    freezeTableName: true,
});

module.exports = Genre;