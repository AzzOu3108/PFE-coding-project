const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB')

// Join table for tache_utilisateur
const tache_utilisateur = sequelize.define('tache_utilisateur', {
    tache_id:{
        type: DataTypes.INTEGER,
        references: {
            model: 'tache',
            key: 'id',
        },
    },
    utilisateur_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'utilisateur',
            key: 'id',
        },
    }
},{
    tableName:'tache_utilisateur',
    timestamps: false
});

module.exports = tache_utilisateur