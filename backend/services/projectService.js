const { tache, utilisateur } = require("../models");
const { Op } = require("sequelize");

const getProjectFilter = (userRole, userId) => {
  switch (userRole) {
    case 'administrateur':
    case 'directeur':
      return {};

    case 'chef de projet':
      return { created_by: userId };
    case 'utilisateur':
      return {
        [Op.or]: [
          { '$utilisateurs.id$': userId },
          { '$taches.utilisateurs.id$': userId } 
        ]
      };

    default:
      return { id: null }; 
  }
};


const getUserInclude = () => ({
  model: utilisateur,
  through: { attributes: [] },
  as: 'utilisateurs',
  attributes: ['id', 'nom_complet'], 
  required: false
});

const getTaskInclude = () => ({
  model: tache,
  as: 'taches',
  through: { attributes: [] },
  attributes: [
    'id',
    'titre',
    'statut',
    'date_de_debut_tache',
    'date_de_fin_tache',
    'poids',
    'created_by'
  ],
  include: [{
    model: utilisateur,
    as: 'utilisateurs',
    through: { attributes: [] },
    attributes: ['id', 'nom_complet'], 
    required: false
  }]
});


module.exports = { getProjectFilter, getUserInclude, getTaskInclude };