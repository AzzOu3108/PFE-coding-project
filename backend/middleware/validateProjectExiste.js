const { projet } = require("../models");

const validateProjectExiste = async (req, res, next) => {
  try {
    
    const projectId = req.params.projectId;

    if (!projectId) {
      return res.status(400).json({ 
        message: "L'ID du projet est requis dans l'URL." 
      });
    }

    const project = await projet.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({ 
        message: "Projet introuvable." 
      });
    }

    req.project = project;
    next();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la vérification du projet."});
  }
};

module.exports = validateProjectExiste;