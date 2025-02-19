const { projet } = require('../models')

const validateProjectExiste = async (req, res, next) =>{
    try {
        const project = await projet.findByPk(req.params.projectId);

        if(!project){
            return res.status(404).json({ message: "Projet introuvable" });
        }

        req.project = project;
        next()
    } catch (error) {
        res.status(500).json({ message: "Erreur de validation du projet" });
    }
};

module.exports = validateProjectExiste