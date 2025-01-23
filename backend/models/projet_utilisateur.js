const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB')

// Join table for projet_utilisateur
const projet_utilisateur = sequelize.define('projet_utilisateur',{
    projet_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'projet',
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
    tableName: 'projet_utilisateur',
    timestamps: false
});

module.exports = projet_utilisateur