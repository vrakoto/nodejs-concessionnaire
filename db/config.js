const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('concessionnaire_sequelize', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = {
    sequelize,
    DataTypes,
    Model,
};