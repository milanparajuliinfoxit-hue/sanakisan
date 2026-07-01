const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GalleryImage = sequelize.define('GalleryImage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  image_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  event: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING, // Matches VARCHAR(50) in MySQL
    defaultValue: "1",
  },
  save_by: {
    type: DataTypes.STRING,
  },
  save_in: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'galleryimages',
  timestamps: false,
});

module.exports = GalleryImage;
