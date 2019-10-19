const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    var token = req.session.token;
    if (!token) {
        token = req.cookies.refresh_token;
        req.session.token = token;
    }
    if (!token) {
        
    } else {
        try {
            var decoded = jwt.verify(token, process.env.TOKEN_CLIENT_PRIVATE);
            req.user = decoded;
        } catch (error) {
            console.log('not jwt');
        }
    }
    next();
}