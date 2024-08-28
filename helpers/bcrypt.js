const bcrypt = require("bcryptjs");

const hashPassword = (password) => bcrypt.hashSync(password, 10);
const comparePassword = (password, dbPassword) => bcrypt.compareSync(password, dbPassword);

module.exports = { hashPassword, comparePassword };
