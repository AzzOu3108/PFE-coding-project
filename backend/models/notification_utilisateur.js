const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB')

// Join table for notification_utilisateur
const notification_utilisateur = sequelize.define('notification_utilisateur',{
    notification_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'notification',
                key: 'id',
            },
        },
        utilisateur_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'utilisateur',
                key: 'id',
            },
        },
},{
    tableName: 'notification_utilisateur',
    timestamps: false
});

module.exports = notification_utilisateur