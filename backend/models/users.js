const { DataTypes } = require('sequelize')
const sequelize = require('../config/DB')

const utilisateur = sequelize.define('utilisateur', {
    utilisateur_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
        type: DataTypes.STRING(10),
        allowNull: false
    },
    numero_telephone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        validate: {
            is: /^\d{10}$/, // Validate it has exactly 10 digits
        },
    },
    departement: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'roles',
            key: 'id'
        },
        allowNull: false
    }
},{
    tableName:'utilisateur',
    timestamps: false
})

module.exports = utilisateur