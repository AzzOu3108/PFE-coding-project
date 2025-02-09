const sequelize = require('../config/DB');
const utilisateur = require('./users');
const projet = require('./project');
const tache = require('./tasks');
const role = require('./roles');
const tache_utilisateur = require('./tache_utilisateur');
const tache_projet = require('./tache_projet');
const projet_utilisateur = require('./projet_utilisateur');
const refreshToken = require('./refreshToken')

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
    as: 'projets',
    onDelete: 'CASCADE'
});

utilisateur.belongsToMany(tache, {
    through: 'tache_utilisateur',
    foreignKey: 'utilisateur_id',
    as: 'taches',
    onDelete: 'CASCADE'
});

projet.belongsToMany(utilisateur, {
    through: 'projet_utilisateur',
    foreignKey: 'projet_id',
    as: 'utilisateurs',
});

projet.belongsToMany(tache, {
    through: 'tache_projet',
    foreignKey: 'projet_id',
    as: 'taches',
    onDelete: 'CASCADE'
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
    onDelete: 'CASCADE'
});

tache_projet.belongsTo(tache, { 
    foreignKey: 'tache_id', 
    onDelete: 'CASCADE' 
});
tache_projet.belongsTo(projet, { 
    foreignKey: 'projet_id', 
    onDelete: 'CASCADE' 
});

tache_utilisateur.belongsTo(tache, { 
    foreignKey: 'tache_id', 
    onDelete: 'CASCADE' 
});
tache_utilisateur.belongsTo(utilisateur, { 
    foreignKey: 'utilisateur_id', 
    onDelete: 'CASCADE' 
});

projet_utilisateur.belongsTo(projet, { 
    foreignKey: 'projet_id', 
    onDelete: 'CASCADE' 
});
projet_utilisateur.belongsTo(utilisateur, { 
    foreignKey: 'utilisateur_id', 
    onDelete: 'CASCADE' 
});

// refreshToken association
refreshToken.belongsTo(utilisateur,{
    foreignKey: 'utilisateur_id',
    onDelete: "CASCADE"
})

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