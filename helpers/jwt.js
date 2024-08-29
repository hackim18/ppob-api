const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const signToken = (payload) => jwt.sign({ email: payload.email }, JWT_SECRET, { expiresIn: "12h" });
const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = { signToken, verifyToken };
