// I wasn't beeing able to run the Express server with the ORM setup on the /bin/www file
// I think that's because the file doens't have the appropriate extension to run the code below (need to understand this better)
// I changed the file extension and some errors started to show up, then I decided to move the db connection to another file
// It worked proprerly

// const app = require('../app'); -> idk why, but this fucker was responsible for TypeError: database.define is not a function

// database packages
const mysql = require('mysql');
const { Sequelize } = require('sequelize');

/**
 * ORM setup
 */

const sequelize = new Sequelize('locallibrary', 'root', 'V01d3m0rt', {
    host: 'localhost',
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