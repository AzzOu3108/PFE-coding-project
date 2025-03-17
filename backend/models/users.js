const { DataTypes } = require('sequelize')
const sequelize = require('../config/DB')

const utilisateur = sequelize.define('utilisateur', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    matricule: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    nom_complet: {
        type: DataTypes.CHAR(40),
        allowNull: false
    },
    adresse_email: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    mot_de_passe: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    numero_telephone: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    departement: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'roles',
            key: 'role_id'
        },
        allowNull: false
    },
    photo_de_profil: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
},{
    tableName:'utilisateur',
    timestamps: false
});


module.exports = utilisateur