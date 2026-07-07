const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const User = require('./User.js');
const CommitteeType = require('./CommitteeType.js');
const CommitteePosition = require('./CommitteePosition.js');

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
    allowNull: true,
  },
  committee_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: CommitteeType, key: 'id' },
  },
  committee_position_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: CommitteePosition, key: 'id' },
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
    defaultValue: 1,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
}, {
  tableName: 'team_members',
  timestamps: true,
});

TeamMember.belongsTo(User, { foreignKey: 'created_by' });
TeamMember.belongsTo(CommitteeType, { foreignKey: 'committee_type_id', as: 'committeeType' });
TeamMember.belongsTo(CommitteePosition, { foreignKey: 'committee_position_id', as: 'committeePosition' });

module.exports = TeamMember;
