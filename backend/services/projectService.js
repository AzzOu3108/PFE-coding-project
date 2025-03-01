const getProjectFilter = async (userRole, userId) =>{
    // Only chef de projet sees projects he created
    if (userRole === 'chef de projet') {
        return { created_by: userId }; // adjust field name if needed
      }
      // Admin and directeur see all projects; utilisateur filtering is done in the include below
      return {};
    }
  
    const getUserInclude = async (userRole, userId, utilisateurModel) => {
      let userInclude = {
        model: utilisateurModel,
        through: { attributes: [] },
        as: 'utilisateurs',
        attributes: ['nom_complet']
      };
  
      // If the role is 'utilisateur', filter to only include projects where he is assigned
      if (userRole === 'utilisateur') {
        userInclude.where = { id: userId };
      }
      return userInclude;
    }
  
   const getTaskInclude = async (userRole, userId, tacheModel, utilisateurModel) => {
      let taskInclude = {
        model: tacheModel,
        through: { attributes: [] },
        as: 'taches',
        attributes: ['titre', 'statut', 'date_de_debut_tache', 'date_de_fin_tache', 'poids'],
        include: [{
          model: utilisateurModel,
          through: { attributes: [] },
          as: "utilisateurs",
          attributes: ['nom_complet']
        }]
      };
  
      // For chef de projet, filter tasks he created
      if (userRole === 'chef de projet') {
        taskInclude.where = { created_by: userId }; // adjust field name if needed
      }
  
      // For utilisateur, only include tasks assigned to him
      if (userRole === 'utilisateur') {
        taskInclude.include[0].where = { id: userId };
      }
      return taskInclude;
    }

module.exports = {getProjectFilter, getUserInclude, getTaskInclude}