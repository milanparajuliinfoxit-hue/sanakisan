const { Sequelize } = require('sequelize');
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = require('./constant');

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  port: 3306,
});


module.exports = sequelize;
