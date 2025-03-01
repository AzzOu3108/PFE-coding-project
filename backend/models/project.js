const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB');

const projet = sequelize.define('projet', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    function_de_projet: {
        type: DataTypes.STRING(70),
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
        type: DataTypes.STRING(40),
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
        type: DataTypes.DATE,
        allowNull: false
    },
    date_de_fin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    buget_global: {
        type: DataTypes.INTEGER(20),
        allowNull: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'utilisateur',
          key: 'id'
        }
      }
}, {
    tableName: 'projet',
    timestamps: false
});

module.exports = projet;