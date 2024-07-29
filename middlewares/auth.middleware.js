const jwt = require("jsonwebtoken");

const loginAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const authenticated = jwt.verify(token, process.env.SECRET_KEY);
    if (authenticated) {
      next();
    }
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = {
  loginAuth,
};
