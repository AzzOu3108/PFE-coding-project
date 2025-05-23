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
    created_by :{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'utilisateur',
            key: 'id'
        }
    }
}, {
    tableName: 'tache',
    timestamps: false,
});


module.exports = tache;