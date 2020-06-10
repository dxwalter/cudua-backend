module.exports = function authentiCateUser (accessToken) {

    const jwt = require('jsonwebtoken');

    let verify = jwt.verify(accessToken, process.env.SHARED_SECRET, (err, user) => {
        if (err) {
            return {
                code: 401,
                error: true,
                success : false,
                message : 'Invalid access token. Sign out and sign into your account again'
            }
        } else {
            return {
                success: true,
                error: false,
                message: user.id
            }
        }

    });

    return verify;
}