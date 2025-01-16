const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB');

const role = sequelize.define('roles',{
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
},{
    tableName: 'roles',
    timestamps: false,
});

module.exports = role