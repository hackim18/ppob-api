const { sequelize } = require("../models");

class InformationController {
  static async getAllBanners(req, res, next) {
    try {
      const banners = await sequelize.query('SELECT * FROM "Banners"', { type: sequelize.QueryTypes.SELECT });

      res.status(200).json(banners);
    } catch (error) {
      next(error);
    }
  }
  static async getAllServices(req, res, next) {
    try {
      const services = await sequelize.query('SELECT * FROM "Services"', { type: sequelize.QueryTypes.SELECT });

      res.status(200).json(services);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InformationController;
