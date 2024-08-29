const { z } = require("zod");
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
  static async topupBalance(req, res, next) {
    const { top_up_amount } = req.body;
    try {
      const topupSchema = z.object({
        top_up_amount: z.number().int().positive("Top up amount must be positive"),
      });

      topupSchema.parse({ top_up_amount: Number(top_up_amount) });

      const { email } = req.user;

      const updatedUser = await sequelize.query(
        'UPDATE "Users" SET balance = balance + :top_up_amount WHERE email = :email RETURNING balance',
        {
          replacements: { top_up_amount, email },
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      res.status(200).json({ message: "Top up success", data: updatedUser[0][0] });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;
