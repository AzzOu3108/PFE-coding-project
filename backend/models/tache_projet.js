const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB')


//Join table for tache_projet
const tache_projet = sequelize.define('tache_projet',{
    projet_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'projet',
            key: 'id',
        },
    },
    tache_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'tache',
            key: 'id',
        },
    },
},{
    tableName:'tache_projet',
    timestamps: false
});

module.exports = tache_projet