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

        const userRaw = await User.create({
            user_name: 'Lightning Mcqueen',
            user_email: 'lightningmcqueen@outlook.com',
            role_id: 2
        });

        const userTxt = JSON.stringify(userRaw);
        const user = JSON.parse(userTxt);

        await bcrypt.genSalt(async (err, salt) => {
            await bcrypt.hash('password', salt, async (err, hash) => {
                const password = await Password.create({
                    user_id: user.id,
                    user_salt: salt,
                    user_hash: 2
                });
            })
        });

        console.log("------------------------------------------");

        console.log(user);

        console.log("------------------------------------------");

        console.log();

        console.log("------------------------------------------");
    }
    catch (error) {
        console.error('debbug: ', error);
    }
}

testModels();