const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { sequelize } = require("../models");
const { z } = require("zod");

class UserController {
  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const userSchema = z.object({
        email: z.string().min(1, "Email is required").email("Email is not valid"),
        password: z.string().min(8, "Password at least 8 characters long"),
      });

      userSchema.parse({ email, password });

      const user = await sequelize.query(
        'SELECT * FROM "Users" WHERE email = :email LIMIT 1',
        {
          replacements: { email },
          type: sequelize.QueryTypes.SELECT,
        },
        { email }
      );

      if (!user.length) throw { name: "Unauthenticated", message: "Email or password is incorrect" };

      const isPasswordMatch = comparePassword(password, user[0].password);

      if (!isPasswordMatch) throw { name: "Unauthenticated", message: "Email or password is incorrect" };

      const payload = { id: user[0].id, is_admin: user[0].is_admin };

      const access_token = signToken(payload);

      res.status(200).json({ message: "Login success", data: { token: access_token } });
    } catch (error) {
      next(error);
    }
  }
  static async register(req, res, next) {
    const { email, password, first_name, last_name } = req.body;
    try {
      const userSchema = z.object({
        email: z.string().min(1, "Email is required").email("Email is not valid"),
        password: z.string().min(8, "Password at least 8 characters long"),
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
      });

      userSchema.parse({ email, password, first_name, last_name });

      const user = await sequelize.query('SELECT * FROM "Users" WHERE email = :email LIMIT 1', {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      });

      if (user.length) throw { name: "Conflict", message: "Email is already registered" };

      const hashedPassword = hashPassword(password);

      const now = new Date();

      const newUser = await sequelize.query(
        'INSERT INTO "Users" (email, password, first_name, last_name, "createdAt", "updatedAt") VALUES (:email, :password, :first_name, :last_name, :now, :now) RETURNING id, email, first_name, last_name',
        {
          replacements: { email, password: hashedPassword, first_name, last_name, now },
          type: sequelize.QueryTypes.INSERT,
        }
      );

      res.status(201).json({ message: "Register success", data: newUser[0][0] });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
