const projet = require('../models/project')
const bcrypt = require('bcryptjs')

const getAllProjects = async (req, res) =>{
    try {
        const project = await projet.findAll()
        if(!project.length){
            res.status(404).json({ message: "Il n'y a pas des projets"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};


const getProjectByName = async (req, res) =>{
    const {nom_de_projet} = req.body
    if(!nom_de_projet){
        return res.status(400).json({ message: "Entrez le nom complet de projet" });
    }

    try {
        const project = await projet.findOne({ where: { nom_de_projet } });
        if (!project) {
            return res.status(404).json({ message: "Il n'y a pas de projet" });
        }
        res.json({ project });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur du serveur' }); 
    }
};


const createProject = async (req, res) =>{
    const {} = req.body
};


const updateProject = async (req, res) =>{

};


const deleteProject = async (req, res) =>{

};


module.exports = {
    getAllProjects,
    getProjectByName,
    createProject,
    updateProject,
    deleteProject
}