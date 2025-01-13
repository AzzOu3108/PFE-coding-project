const tache = require('./tasks')
const projet = require('./projet')

tache.belongsToMany(projet, {
    through: 'tache_projet',
    foreignKey: 'tache_id',
    otherKey: 'projet_id'
})

projet.belongsToMany(tache, {
    through: 'tache_projet',
    foreignKey: 'projet_id',
    otherKey: 'tache_id',
});