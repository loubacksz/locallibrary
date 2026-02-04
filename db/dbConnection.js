// I wasn't beeing able to run the Express server with the ORM setup on the /bin/www file
// I think that's because the file doens't have the appropriate extension to run the code below (need to understand this better)
// I changed the file extension and some errors started to show up, then I decided to move the db connection to another file
// It worked proprerly

// const app = require('../app'); -> idk why, but this fucker was responsible for TypeError: database.define is not a function

require('dotenv').config();
// database packages
const mysql = require('mysql');
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