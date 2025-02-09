const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB')

const refreshToken = sequelize.define('refreshToken',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    token:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    
})