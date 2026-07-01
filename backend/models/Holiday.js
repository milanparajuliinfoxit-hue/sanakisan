const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Holiday = sequelize.define('Holiday', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  holiday_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
  type: DataTypes.BOOLEAN,
  defaultValue: true,
},

created_at: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW,
},
}, {
  tableName: 'holiday',
  timestamps: false,
});

module.exports = Holiday;