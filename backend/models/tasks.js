const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB');

const tache = sequelize.define('tache', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    titre: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    equipe: {
        type: DataTypes.JSON,
    },
    statut: {
        type: DataTypes.STRING(11),
        allowNull: false,
        validate: {
            isIn: [['A faire', 'En cours', 'Terminée', 'En attente', 'Annulée']],
        },
    },
    date_de_debut_tache: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    date_de_fin_tache: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isAfter: function (value) {
                if (this.date_de_debut_tache && value <= this.date_de_debut_tache) {
                    throw new Error('La date de fin doit être après la date de début.');
                }
            },
        },
    },
    poids: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'tache',
    timestamps: false,
});

module.exports = tache;