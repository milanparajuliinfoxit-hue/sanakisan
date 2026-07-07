const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const CommitteeType = sequelize.define('CommitteeType', {
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
  tableName: 'committee_types',
  timestamps: true,
});

module.exports = CommitteeType;
