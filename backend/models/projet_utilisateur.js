const sequelize = require('../config/DB')

// Join table for projet_utilisateur
const projet_utilisateur = sequelize.define('projet_utilisateur',{},{
    tableName: 'projet_utilisateur',
    timestamps: false
});

module.exports = projet_utilisateur