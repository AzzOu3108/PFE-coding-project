const sequelize = require('../config/DB')

// Join table for tache_utilisateur
const tache_utilisateur = sequelize.define('tache_utilisateur', {},{
    tableName:'tache_utilisateur',
    timestamps: false
});

module.exports = tache_utilisateur