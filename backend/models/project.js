const { DataTypes } = require('sequelize')
const sequelize = require('../config/DB')
const utilisateur = require('./users')

const projet = sequelize.define('projet', {
    projet_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    utilisateur_id : {
        type: DataTypes.INTEGER,
        references: {
            model: 'utilisateur',
            key: 'utilisateur_id'
        },
        allowNull: false
    },
    nom_complet: {
        type: DataTypes.CHAR(40),
        allowNull: false
    },
    numero_telephone_utilisateur: {
        type: DataTypes.INTEGER(10),
        allowNull: false
    },
    function: {
        type: DataTypes.STRING(70),
        allowNull: false
    },
    departement: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    nom_programme: {
        type: DataTypes.CHAR(40),
        allowNull: false
    },
    sponsor_de_programme: {
        type: DataTypes.CHAR(40),
        allowNull: false
    },
    manager_de_projet: {
        type: DataTypes.CHAR(40),
        allowNull: false
    },
    nom_de_projet: {
        type: DataTypes.CHAR(40),
        allowNull: false
    },
    controle_des_couts: {
        type: DataTypes.INTEGER(20),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    objective: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    date_de_debut: {
        type: DataTypes.DATE(10),
        allowNull: false
    },
    date_de_fin: {
        type: DataTypes.DATE(10),
        allowNull: false
    },
    buget_global: {
        type: DataTypes.INTEGER(20),
        allowNull: false
    }
},{
    tableName: 'projet',
    timestamps: true
})

module.exports = projet