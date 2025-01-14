const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB');

const role = sequelize.define('role',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
},{
    tableName: 'role',
    timestamps: false,
});

module.exports = role