const jwt = require('jsonwebtoken');
const User = require('./models/user');

/* 
  to access the cookies and user input and to call the controller functions 
  this middleware must have access to the req, res and next parameters

  - calling this on the 'catalog' page might not be correct, because if the secret is wrong, 
    the user will be stucked on the login page
*/

const authFunction = (req, res, next) => {
    // assign cookie value to a variable
    const token = req.cookies.jwt;

    // check if the cookie exists
    if (token) {
        // verifying cookie
        jwt.verify(token, 'test', (err, decodedToken) => {
            // verifying cookie error handler
            if (err) {
                console.log(err.message + ' -----------------------------');
                res.redirect('/'); // i think that this error Error [ERR_HTTP_HEADERS_SENT] is happening
                                   // because im trying to redirect without deleting the cookies
            } else {
                console.log(decodedToken);
                next();
            }
        });
    }
    // checking if the cookie exists error handler
    else {
        res.redirect('/');
    }
}

// check current user
const checkUser = (req, res, next) => {
    // assign cookie value to a variable
    const token = req.cookies.jwt;

    // check if the cookie exists
    if (token) {
        // verifying cookie
        jwt.verify(token, 'test', async (err, decodedToken) => {
            // verifying cookie error handler
            if (err) {
                console.log(err.message + ' -----------------------------');

                // if there is a jwt error, the user is not logged, so set user to null
                res.locals.exports = null;

                next(); // the token is not valid, there is no user logged in
                        // so the code continues normally 
            } else {
                // searching for user with jwt
                let userRaw = await User.findByPk(decodedToken.id);
                const userTxt = JSON.stringify(userRaw)
                const user = JSON.parse(userTxt);

                // using res.locals to send user info to the views
                res.locals.exports = user;
                next();
            }
        });
    }
    // checking if the cookie exists error handler
    else {
        // if there is no jwt, the user is not logged, 
        // so set user to null and call the next function in the stack
        console.log('no user logged -----------------');
        res.locals.exports = null;
        next();
    }
}

module.exports = { authFunction, checkUser };