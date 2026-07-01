// config/database.js
const { Sequelize } = require('sequelize');
const config = require('./config.json');

const environment = process.env.NODE_ENV || 'development';
const { username, password, database, host, dialect, port } = config[environment];
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  port
});

module.exports = sequelize;

