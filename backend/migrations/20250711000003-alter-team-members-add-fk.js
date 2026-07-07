'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('team_members', 'committee_type_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'committee_types', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('team_members', 'committee_position_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'committee_positions', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('team_members', 'committee_type_id');
    await queryInterface.removeColumn('team_members', 'committee_position_id');
  },
};
