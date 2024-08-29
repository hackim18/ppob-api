const { sequelize } = require("../models");

class TransactionController {
  static async getBalance(req, res, next) {
    try {
      const { email } = req.user;

      const user = await sequelize.query(
        'SELECT balance FROM "Users" WHERE email = :email LIMIT 1',
        {
          replacements: { email },
          type: sequelize.QueryTypes.SELECT,
        },
        { email }
      );

      res.status(200).json({ message: "Success", data: user[0] });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;
