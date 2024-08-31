const { z } = require("zod");
const { sequelize } = require("../models");

class TransactionController {
  static async getBalance(req, res, next) {
    try {
      const { id } = req.user;

      const [user] = await sequelize.query('SELECT balance FROM "Users" WHERE id = :id LIMIT 1', {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      });

      res.status(200).json({ message: "Success", data: user });
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

      const { id } = req.user;

      const [updatedUser] = await sequelize.query(
        'UPDATE "Users" SET balance = balance + :top_up_amount WHERE id = :id RETURNING balance',
        {
          replacements: { top_up_amount, id },
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      res.status(200).json({ message: "Top up success", data: updatedUser[0] });
    } catch (error) {
      next(error);
    }
  }

  static async payTransaction(req, res, next) {
    const { service_code } = req.body;
    const invoice_number = `INV${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    try {
      const paySchema = z.object({
        service_code: z.string().min(1, "Service code is required"),
      });
      paySchema.parse({ service_code });

      const { email } = req.user;
      const [serviceDetails] = await sequelize.query(
        'SELECT service_code, service_name, service_tariff FROM "Services" WHERE service_code = :service_code',
        {
          replacements: { service_code },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      console.log("🚀 ~ TransactionController ~ payTransaction ~ serviceDetails:", serviceDetails);

      if (!serviceDetails) {
        return res.status(404).json({ message: "Service not found" });
      }

      const serviceTariff = serviceDetails.service_tariff;
      const [userId] = await sequelize.query('SELECT id FROM "Users" WHERE email = :email', {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      });

      await sequelize.query(
        'INSERT INTO "Transactions" (user_id, invoice_number, service_code, transaction_type, total_amount, "createdAt", "updatedAt") VALUES (:user_id, :invoice_number, :service_code, :transaction_type, :total_amount, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
        {
          replacements: {
            user_id: userId.id,
            invoice_number,
            service_code,
            transaction_type: "Top-up",
            total_amount: serviceTariff,
          },
          type: sequelize.QueryTypes.INSERT,
        }
      );

      const [transaction] = await sequelize.query(
        'UPDATE "Transactions" SET transaction_type = :transaction_type WHERE invoice_number = :invoice_number RETURNING *',
        {
          replacements: {
            transaction_type: "Completed",
            invoice_number,
          },
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      res.status(200).json({ message: "Pay success", data: transaction[0] });
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionHistory(req, res, next) {
    try {
      const { id } = req.user;
      const { offset = 0, limit = 5 } = req.query;
      console.log("🚀 ~ TransactionController ~ getTransactionHistory ~ id:", id);

      const transactions = await sequelize.query(
        'SELECT t.id, u.email AS user_email, t.invoice_number, s.service_name, s.description, t.transaction_type, t.total_amount, t."createdAt" FROM "Transactions" t JOIN "Users" u ON t.user_id = u.id JOIN "Services" s ON t.service_code = s.service_code WHERE t.user_id = :id ORDER BY t."createdAt" DESC OFFSET :offset LIMIT :limit',
        {
          replacements: { id, offset, limit },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      res.status(200).json({ message: "Success", data: { offset, limit, records: transactions } });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;
