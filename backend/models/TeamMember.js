const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const User = require('./User.js');

const TeamMember = sequelize.define('TeamMember', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  feature_image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,   
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tenure: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
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
  tableName: 'team_members',
  timestamps: true,
});

TeamMember.belongsTo(User, { foreignKey: 'created_by' });

module.exports = TeamMember;
