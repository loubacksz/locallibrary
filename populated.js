const database = require('./db/dbConnection');
const Author = require('./models/author');
const Book = require('./models/book');
const Genre = require('./models/genre');
const GenreBook = require('./models/genrebook');
const BookInstance = require('./models/bookinstance');
const User = require('./models/user');
const Role = require('./models/role');
const associations = require('./models/associations');
const bcrypt = require('bcrypt');
const Password = require('./models/password');

async function testModels(){
    try {
        associations(); //it's necessary to call the associations before making CRUD
        //await database.sync({alter: {drop: false}}); //- no need to sync every time, this will only change the tables

        // const saltRaw = await Password.findAll({
        //     attributes: ['user_salt', 'user_password'],
        //     include: [{
        //         model: User,
        //         where: {
        //             user_email: 'tommatter@gmail.com'
        //     }}],
        // });

        // const saltTxt = JSON.stringify(saltRaw);
        // const salt = JSON.parse(saltTxt);

        const salt = await sequelize.query('SELECT user_password, user_salt ' +
                                           'FROM password ' + 
                                           'LEFT JOIN user ' +
                                           'ON password.user_id = user.user_id ' +
                                           'WHERE user.user_email = ?' , { replacements: [`${req.body.email.toLowerCase()}`], type: sequelize.QueryTypes.SELECT });

        console.log("------------------------------------------");

        console.log(salt);

        console.log("------------------------------------------");

        console.log();

        console.log("------------------------------------------");
    }
    catch (error) {
        console.error('debbug: ', error);
    }
}

testModels();