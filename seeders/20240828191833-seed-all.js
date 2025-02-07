"use strict";

const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const seedData = (dataPath) =>
      require(`../seeders/data/${dataPath}.json`).map((el) => {
        el.createdAt = el.updatedAt = new Date();
        return el;
      });

    const users = seedData("users").map((user) => {
      user.password = hashPassword(user.password);
      return user;
    });

    await queryInterface.bulkInsert("Users", users, {});
    await queryInterface.bulkInsert("Banners", seedData("banners"), {});
    await queryInterface.bulkInsert("Services", seedData("services"), {});
    await queryInterface.bulkInsert("Transactions", seedData("transactions"), {});
  },

  async down(queryInterface, Sequelize) {
    const deleteOptions = {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    };
    await queryInterface.bulkDelete("Users", null, deleteOptions);
    await queryInterface.bulkDelete("Banners", null, deleteOptions);
    await queryInterface.bulkDelete("Services", null, deleteOptions);
    await queryInterface.bulkDelete("Transactions", null, deleteOptions);
  },
};
