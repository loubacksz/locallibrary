const User = require('../../models/user');
const Role = require('../../models/role');
const jwt = require('jsonwebtoken');

const checkUserCredentials = async (req, res) => {
    try {
        // assign user token that comes from the home view
        const token = req.cookies.jwt;

        // if we have token -> verify it -> if errors (user not logged) -> redirect ->
        // else -> find user role -> check user role ->
        // if user role === 'admin' -> return true ->
        // else -> return false

        // checking token
        if (token) {
            const user_data = await jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
                if (err) {
                    console.log(' ----------------------------- ' + err.message + ' -----------------------------');
                    // res.cookie('jwt', '',{ httpOnly: true, maxAge: 1, expires: 1 });
                    // res.redirect('/catalog'); // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client 
                                                 // -> I think that this error is because I already rendered the index to the user after the login post request,
                                                 // wich automatically calls a get request because it redirects to /catalog -> and in the /catalog I call again for redirect() here on this function
                                                 // there was no need for redirecting again since this same page was already rendered - that was the problem
                    return false;
                } else {
                    const userDataRaw = await User.findByPk(decodedToken.id, {
                        include: {
                            model: Role,
                            attributes: ['role_name'],
                        },
                        attributes: {
                            exclude: ['user_id', 'user_name', 'role_id', 'user_email']
                        }
                    });
                    const userDataTxt = JSON.stringify(userDataRaw);
                    const userData = JSON.parse(userDataTxt);

                    if (userData.role.role_name === 'admin') {
                        return true;
                    } else {
                        return false;
                    }
                }
            });

            console.log(user_data);
            return user_data;
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = { checkUserCredentials };