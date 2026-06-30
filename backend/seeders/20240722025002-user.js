"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("Fncci@123", 10);

    await queryInterface.bulkInsert("user", [
      {
        fullname: "Admin Admin",
        username: "admin2",
        email: "admin2@admin.com",
        password: hashedPassword,
        user_type: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user", { username: "admin" });
  },
};
