const jwt = require('jsonwebtoken');


const loginAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const authenticated = jwt.verify(token, "abc?123");
        if (authenticated) {
            next();
        }
    }
    catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}


const userAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const authenticated = jwt.verify(token, "abc?123");
        if (authenticated.userType === 'user') {
            next();
        } else {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}


module.exports = {
    loginAuth,
    userAuth
}