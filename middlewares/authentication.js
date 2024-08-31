const { verifyToken } = require("../helpers/jwt");
const { sequelize } = require("../models");

async function authentication(req, res, next) {
  try {
    const access_token = req.headers.authorization;

    if (!access_token) throw { name: "Unauthenticated", message: "Access token is required" };
    const [type, token] = access_token.split(" ");

    if (type !== "Bearer") throw { name: "Unauthenticated" };
    const payload = verifyToken(token);
    console.log("🚀 ~ authentication ~ payload:", payload);

    const { email } = payload;

    const [user] = await sequelize.query(
      'SELECT * FROM "Users" WHERE email = :email LIMIT 1',
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      },
      { email }
    );

    if (!user) throw { name: "Unauthenticated" };

    req.user = { id: user.id, email: user.email };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authentication;
