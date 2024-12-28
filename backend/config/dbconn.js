const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME, // Project database name
    process.env.DB_USER, // MySQL username
    process.env.DB_PASSWORD, // MySQL password
    {
        host: process.env.DB_HOST, // Use 'db' for Docker Compose networking
        port: process.env.DB_PORT, // Default MySQL port
        dialect: process.env.DB_DIALECT, // 'mysql'
        logging: console.log, // Optional: Logs SQL queries for debugging
    }
);

module.exports = sequelize;
