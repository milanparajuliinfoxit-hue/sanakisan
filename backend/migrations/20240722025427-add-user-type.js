'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user', 'user_type', {
      type: Sequelize.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('user', 'user_type');
  },
};
