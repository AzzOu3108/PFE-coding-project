const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB');

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
        type: DataTypes.STRING(50), // Changed from CHAR to STRING for flexibility
        allowNull: false
    },
    statut: {
        type: DataTypes.STRING(11), // Changed from CHAR to STRING for consistency
        allowNull: false,
        validate: {
            isIn: [['pending', 'in_progress', 'completed']]
        }
    },
    date_de_debut_tache: { 
        type: DataTypes.DATE,
        allowNull: false
    },
    date_de_fin_tache: { 
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isAfter: this.date_de_debut_tache 
        }
    },
    poids: {
        type: DataTypes.INTEGER, 
        allowNull: false
    }
}, {
    tableName: 'tache',
    timestamps: false
});

module.exports = tache;