
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const secret = process.env.JWT_KEY;
const authMiddleWare = async (req, res, next) => {
    if (req.headers["x-custom-header"]) {

        try {
            const token = req.headers["x-custom-header"];
            console.log(token)
            if (token) {
                const decoded = jwt.verify(token, secret);
                console.log(decoded)
                req.body._id = decoded?.id;
            }
            next();
        } catch (error) {
            console.log(error);
        }
    } else {
        return res.status(200).send({ errormsg: "authentication failed" });

    }
};

module.exports = { authMiddleWare }