const { projet } = require("../models");

const validateProjectExiste = async (req, res, next) => {
  try {
    // 1. Get projectId from URL parameters
    const projectId = req.params.projectId;

    // 2. Check if projectId exists
    if (!projectId) {
      return res.status(400).json({ 
        message: "L'ID du projet est requis dans l'URL." 
      });
    }

    // 3. Find the project
    const project = await projet.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({ 
        message: "Projet introuvable." 
      });
    }

    // 4. Attach project to request object
    req.project = project;
    next();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la vérification du projet."});
  }
};

module.exports = validateProjectExiste;