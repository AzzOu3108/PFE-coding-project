const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB')

const refreshToken = sequelize.define('refreshToken',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'utilisateur',
            key: 'id',
        },
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = refreshToken