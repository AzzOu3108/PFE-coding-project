const sequelize = require('../config/DB');
const utilisateur = require('./users');
const projet = require('./project');
const tache = require('./tasks');
const role = require('./roles');
const tache_utilisateur = require('./tache_utilisateur');
const tache_projet = require('./tache_projet');
const projet_utilisateur = require('./projet_utilisateur');

// Associations
utilisateur.belongsTo(role, {
    foreignKey: 'role_id',
    as: 'role'
});

role.hasOne(utilisateur, { 
    foreignKey: 'role_id',
    as: 'user' 
});

utilisateur.belongsToMany(projet, {
    through: 'projet_utilisateur',
    foreignKey: 'utilisateur_id',
    as: 'projets'
});

utilisateur.belongsToMany(tache, {
    through: 'tache_utilisateur',
    foreignKey: 'utilisateur_id',
    as: 'taches'
});

// Define associations
projet.belongsToMany(utilisateur, {
    through: 'projet_utilisateur',
    foreignKey: 'projet_id',
    as: 'utilisateurs',
});

projet.belongsToMany(tache, {
    through: 'tache_projet',
    foreignKey: 'projet_id',
    as: 'taches',
});

tache.belongsToMany(utilisateur, {
    through: 'tache_utilisateur',
    foreignKey: 'tache_id',
    as: 'utilisateurs',
});

tache.belongsToMany(projet, {
    through: 'tache_projet',
    foreignKey: 'tache_id',
    as: 'projets',
});

module.exports = {
    sequelize,
    utilisateur,
    projet,
    tache,
    role,
    tache_utilisateur,
    tache_projet,
    projet_utilisateur
};