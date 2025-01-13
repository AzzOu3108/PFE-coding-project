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
    const {titre, equipe, statut, date_de_debut_tache, date_de_fin_tache, poids} = req.body

    if(!titre ||!equipe ||!statut ||!date_de_debut_tache ||!date_de_fin_tache ||!poids){
        return res.status(400).json({ message: "Veuillez remplir tous les champs." });
    }

    if (new Date(date_de_debut_tache) >= new Date(date_de_fin_tache)) {
        return res.status(400).json({ message: "La date de début doit être antérieure à la date de fin." });
    }

    try {
        const existingTask = await tache.findOne({where: titre, })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
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