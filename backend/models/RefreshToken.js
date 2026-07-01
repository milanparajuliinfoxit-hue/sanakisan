const { DataTypes } = require("sequelize");
const User = require("./User");
const sequelize = require("../config/database");


const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'refresh_tokens',
  timestamps: true
});

RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

module.exports = RefreshToken;
