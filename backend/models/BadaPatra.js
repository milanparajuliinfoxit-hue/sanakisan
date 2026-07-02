const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BadaPatra = sequelize.define('BadaPatra', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'bada_patra',
  timestamps: true,
});

module.exports = BadaPatra;
