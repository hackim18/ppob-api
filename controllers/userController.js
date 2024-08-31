const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { sequelize } = require("../models");
const { z } = require("zod");
const cloudinary = require("cloudinary").v2;

class UserController {
  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const userSchema = z.object({
        email: z.string().min(1, "Email is required").email("Email is not valid"),
        password: z.string().min(8, "Password at least 8 characters long"),
      });

      userSchema.parse({ email, password });

      const [user] = await sequelize.query(
        'SELECT * FROM "Users" WHERE email = :email LIMIT 1',
        {
          replacements: { email },
          type: sequelize.QueryTypes.SELECT,
        },
        { email }
      );

      if (!user) throw { name: "Unauthenticated", message: "Email or password is incorrect" };

      const isPasswordMatch = comparePassword(password, user.password);

      if (!isPasswordMatch) throw { name: "Unauthenticated", message: "Email or password is incorrect" };

      const payload = { id: user.id, email: user.email };

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

      const [user] = await sequelize.query('SELECT * FROM "Users" WHERE email = :email LIMIT 1', {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      });

      if (user) throw { name: "Conflict", message: "Email is already registered" };

      const hashedPassword = hashPassword(password);

      const now = new Date();

      const [newUser] = await sequelize.query(
        'INSERT INTO "Users" (email, password, first_name, last_name, "createdAt", "updatedAt") VALUES (:email, :password, :first_name, :last_name, :now, :now) RETURNING id, email, first_name, last_name',
        {
          replacements: { email, password: hashedPassword, first_name, last_name, now },
          type: sequelize.QueryTypes.INSERT,
        }
      );

      res.status(201).json({ message: "Register success", data: newUser[0] });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const { id } = req.user;

      const [user] = await sequelize.query('SELECT id, email, first_name, last_name FROM "Users" WHERE id = :id LIMIT 1', {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      });

      res.status(200).json({ message: "Success", data: user });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    const { first_name, last_name } = req.body;
    try {
      const userSchema = z.object({
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
      });

      userSchema.parse({ first_name, last_name });

      const { id } = req.user;

      const [updatedUser] = await sequelize.query(
        'UPDATE "Users" SET first_name = :first_name, last_name = :last_name WHERE id = :id RETURNING id, email, first_name, last_name',
        {
          replacements: { first_name, last_name, id },
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      res.status(200).json({ message: "Update success", data: updatedUser[0] });
    } catch (error) {
      next(error);
    }
  }
  static async updateImage(req, res, next) {
    try {
      if (!req.file) throw { name: "BadRequest", message: "Image is required" };
      cloudinary.config({
        cloud_name: process.env.CLOUND_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      });
      const mimeType = req.file.mimetype;
      const data = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${mimeType};base64,${data}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        overwrite: false,
        unique_filename: true,
      });

      const { id } = req.user;

      const [updatedUser] = await sequelize.query(
        'UPDATE "Users" SET profile_image = :profile_image WHERE id = :id RETURNING id, email, first_name, last_name, profile_image',
        {
          replacements: { profile_image: result.secure_url, id },
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      res.status(200).json({ message: "Update success", data: updatedUser[0] });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
