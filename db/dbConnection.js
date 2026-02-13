require('dotenv').config();
const { Sequelize } = require('sequelize');

/**
 * ORM setup
 */

const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

async function dbAuthentication() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database: ', error);
    }
}

dbAuthentication();

module.exports = sequelize;