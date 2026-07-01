const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const User = require('./User.js');

const PressRelease = sequelize.define('PressRelease', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  featuredImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  publishStatus: {
    type: DataTypes.ENUM('draft', 'published'),
    allowNull: false,
    defaultValue: 'draft'
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  publishDate: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.NOW
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'press_release_info',
  timestamps: true
});

PressRelease.belongsTo(User, { foreignKey: 'created_by' });

module.exports = PressRelease;