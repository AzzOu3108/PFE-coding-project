const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB')

const refreshtoken = sequelize.define('refreshtoken',{
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
        unique: true,
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
    tableName: "refreshtoken",
    timestamps: true
});

module.exports = refreshtoken