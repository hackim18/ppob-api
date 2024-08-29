"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {}
  }
  Service.init(
    {
      service_code: DataTypes.STRING,
      service_name: DataTypes.STRING,
      service_icon: DataTypes.STRING,
      service_tariff: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Service",
    }
  );
  return Service;
};
