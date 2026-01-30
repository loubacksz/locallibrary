const jwt = require('jsonwebtoken');

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
        jwt.verify(token, 'test', (err, decoded) => {
            // verifying cookie error handler
            if (err) {
                console.log(err.message + ' -----------------------------');
                res.redirect('/'); // i think that this error Error [ERR_HTTP_HEADERS_SENT] is happening
                                   // because im trying to redirect without deleting the cookies
            }
            console.log(decoded);
            next();
        });
    }
    // checking if the cookie exists error handler
    else {
        res.redirect('/');
    }
}

module.exports = { authFunction };