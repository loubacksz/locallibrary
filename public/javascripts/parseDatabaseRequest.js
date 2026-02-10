const  parseDatabaseRequest = (requestResult) => {
    let txt = JSON.stringify(requestResult);
    let parsed = JSON.parse(txt);
    return parsed;
}

module.exports = { parseDatabaseRequest };

// must check if is possible to make this method a sequelize static method