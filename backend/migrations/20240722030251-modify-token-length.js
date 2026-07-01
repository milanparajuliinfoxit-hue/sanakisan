'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('refresh_tokens', 'token', {
      type: Sequelize.TEXT, // Using TEXT to accommodate long token strings
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('refresh_tokens', 'token', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
