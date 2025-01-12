const tache = require('../models/tasks')
const projet = require('../models/project')
const utilisateur = require('../models/users')

const getAllTasks = async (req, res) =>{
    try {
        const tasks = await tache.findAll({
            include: [
                { model: projet, attributes: ['npm_de_projet'] },
                { model: utilisateur, attributes: ['nom_complet'], as: 'equipe' },
            ],
        });
        if(!tasks.length){
            return res.status(404).json({ message: "Aucun tache disponible." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};

const createTask = async (req, res) =>{

};

const updateTask = async (req, req) =>{

};

const deleteTask = async (req, res) =>{

};

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
}