const sequelize = require('../config/DB');
const utilisateur = require('./users');
const projet = require('./project');
const tache = require('./tasks');
const role = require('./roles');
const tache_utilisateur = require('./tache_utilisateur');
const tache_projet = require('./tache_projet');
const projet_utilisateur = require('./projet_utilisateur');
const refreshtoken = require('./refreshtoken');
const notification = require('./notification');
const notification_utilisateur = require('./notification_utilisateur');

// Associations:
// user association
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

// Project association
projet.belongsToMany(utilisateur, {
    through: 'projet_utilisateur',
    foreignKey: 'projet_id',
    as: 'utilisateurs',
    onDelete: 'CASCADE'
});

projet.belongsToMany(tache, {
    through: 'tache_projet',
    foreignKey: 'projet_id',
    as: 'taches',
    onDelete: 'CASCADE'
});

projet.belongsTo(utilisateur, {
    foreignKey: 'created_by',
    as: 'creator'
});

// Task association
tache.belongsToMany(utilisateur, {
    through: 'tache_utilisateur',
    foreignKey: 'tache_id',
    as: 'utilisateurs',
    onDelete: 'CASCADE'
});

tache.belongsToMany(projet, {
    through: 'tache_projet',
    foreignKey: 'tache_id',
    as: 'projets',
    onDelete: 'CASCADE'
});

// Join tables association
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
refreshtoken.belongsTo(utilisateur,{
    foreignKey: 'utilisateur_id',
    onDelete: "CASCADE"
});

refreshtoken.belongsTo(utilisateur, {
    foreignKey: 'utilisateur_id',
    onDelete: 'CASCADE'
});

// Notification association
notification.belongsToMany(utilisateur, {
    through: 'notification_utilisateur',
    foreignKey: 'notification_id',
    as: 'utilisateurs',
    onDelete: 'CASCADE'
});

utilisateur.belongsToMany(notification, {
    through: 'notification_utilisateur',
    foreignKey: 'utilisateur_id',
    as: 'notifications',
    onDelete: 'CASCADE'
});

notification.belongsTo(tache, {
    foreignKey: 'tache_id',
    onDelete: 'CASCADE'
});

notification.belongsTo(projet, {
    foreignKey: 'projet_id',
    onDelete: 'CASCADE'
});

notification_utilisateur.belongsTo(notification, {
    foreignKey: 'notification_id',
    onDelete: 'CASCADE'
});

notification_utilisateur.belongsTo(utilisateur, {
    foreignKey: 'utilisateur_id',
    onDelete: 'CASCADE'
});

module.exports = {
    sequelize,
    utilisateur,
    projet,
    tache,
    role,
    tache_utilisateur,
    tache_projet,
    projet_utilisateur,
    refreshtoken,
    notification
};