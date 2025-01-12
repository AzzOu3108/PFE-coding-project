const { DataTypes } = require('sequelize')
const sequelize = require('../config/DB')

const tache = sequelize.define('tache', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    titre: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    equipe: {
        type: DataTypes.CHAR(50),
        allowNull: false
    },
    statut: {
        type: DataTypes.CHAR(11),
        allowNull: false
    },
    data_de_debut_tache: {
        type: DataTypes.DATE,
        allowNull: false
    },
    data_de_fin_tache: {
        type: DataTypes.DATE,
        allowNull:false
    },
    poids: {
        type: DataTypes.INTEGER(3),
        allowNull: false
    }
},{
    tableName:'tache',
    timestamps: false
})

module.exports = tache