const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB');

const notification = sequelize.define('notification', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    contenu:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    tache_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tache',
            key: 'id'
        }
    },
    projet_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'projet',
            key: 'id'
        }
    },
},{
    tableName: 'notification',
    timestamps: true,
    updatedAt: false,
});


module.exports = notification;