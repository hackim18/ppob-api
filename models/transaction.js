"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Transaction.belongsTo(models.Service, {
        foreignKey: "service_code",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Transaction.init(
    {
      user_id: DataTypes.INTEGER,
      invoice_number: DataTypes.STRING,
      service_code: DataTypes.STRING,
      transaction_type: DataTypes.STRING,
      total_amount: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
