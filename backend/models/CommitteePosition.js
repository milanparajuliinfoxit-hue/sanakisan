const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const CommitteePosition = sequelize.define('CommitteePosition', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'committee_positions',
  timestamps: true,
});

module.exports = CommitteePosition;
