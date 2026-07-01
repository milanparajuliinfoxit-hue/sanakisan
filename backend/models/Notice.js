const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const User = require('./User.js');

const Notice = sequelize.define('Notice', {
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
    allowNull: true
  },
  publishStatus: {
    type: DataTypes.ENUM('draft', 'published'),
    allowNull: false,
    defaultValue: 'draft'
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true
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
  tableName: 'notice_info',
  timestamps: true
});

Notice.belongsTo(User, { foreignKey: 'created_by' });

module.exports = Notice;