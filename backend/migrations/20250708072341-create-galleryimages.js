'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('galleryimages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      image_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      event: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 1,
      },
      save_by: {
        type: Sequelize.STRING,
        defaultValue: "admin",
      },
      save_in: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('galleryimages');
  }
};
