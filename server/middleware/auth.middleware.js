const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
    console.log("in the authentication middleware function");

    if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        const theToken = req.headers.authorizations.split(" ")[1];
        const payload = jwt.verify(theToken, process.env.TOKEN_SECRET);

        req.payload = payload;
        next();
    } else {
        res.status(403).json({ message: "no token present" });
    }
}
module.exports = { isAuthenticated };