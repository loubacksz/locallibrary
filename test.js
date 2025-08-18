/*
const { DataTypes } = require('sequelize');
const database = require('./bin/www');

const test = database.define('test', {
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
        type: DataTypes.ENUM(['value', 'another value']),
    },
}, {
    timestamps: false,
    freezeTableName: true
});

async function testEnum(){

    try{

        //await test.sync();

        await test.create({
            imprint: 'test222',
            status: 'another value'
        });

    } catch(err) {
        console.error(err);
    }

}

testEnum();
*/