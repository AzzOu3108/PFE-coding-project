const sequelize = require('../config/DB')

//Join table for tache_projet
const tache_projet = sequelize.define('tache_projet',{},{
    tableName:'tache_projet',
    timestamps: false
});

module.exports = tache_projet