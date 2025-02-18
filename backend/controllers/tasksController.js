const { tache, projet, utilisateur, tache_utilisateur, tache_projet } = require("../models");

// Create a new task and assign users with join table
const createTask = async (req, res) => {
    const { titre, equipe, statut, date_de_debut_tache, date_de_fin_tache, poids, projet_id } = req.body;

    if (!titre || !equipe || !statut || !date_de_debut_tache || !date_de_fin_tache || !poids || !projet_id) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs." });
    }

    if (new Date(date_de_debut_tache) >= new Date(date_de_fin_tache)) {
        return res.status(400).json({ message: "La date de début doit être antérieure à la date de fin." });
    }

    try {
        const existingtask = await tache.findOne({where:{titre}});
        if(existingtask){
            return res.status(409).json({message: "la tâche existe déjà"})
        }

        const project = await projet.findByPk(projet_id);
        if (!project) {
            return res.status(404).json({ message: "Projet introuvable." });
        }

        const users = await utilisateur.findAll({where:{nom_complet: equipe}})

        if(users.length !== equipe.length){
            return res.status(404).json({message: "Un ou plusieurs utilisateurs n'existent pas"})
        }

        const newTask = await tache.create({
            titre,
            statut,
            date_de_debut_tache,
            date_de_fin_tache,
            poids,
            projet_id,
        });

        await tache_projet.create({
            tache_id: newTask.id,
            projet_id: projet_id
        });

        const userTaskEntries = users.map(user => ({
            utilisateur_id: user.id,
            tache_id: newTask.id
        }));
        
        await tache_utilisateur.bulkCreate(userTaskEntries); 

        res.status(201).json({
        message: "Tâche créée avec succès",
        tache: newTask,
        equipe: users.length > 0 ? users.map(user => user.nom_complet) : "Aucune équipe assignée"
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};


const updateTask = async (req, res) => {
    const { id } = req.params;
    const { titre, equipe, statut, date_de_debut_tache, date_de_fin_tache, poids, projet_id } = req.body;

    try {
    if (!id) {
        return res.status(400).json({ message: "L'ID de la tâche est requis." });
    }

    const currentUserRole = req.user.role;

        const task = await tache.findByPk(id, {
            include:[{
                model: utilisateur,
                as: 'utilisteurs',
                through: {
                    attributes: []
                }
            }]
        });

        const validStatuses = ['A faire', 'En cours', 'Terminée', 'En attente', 'Annulée'];

        if(statut && !validStatuses.includes(statut)){
            return res.status(400).json({ message: "Statut de tâche non valide." });
        }
        
        if (!task) {
            return res.status(404).json({ message: "Tâche introuvable." });
        }

        if (projet_id) {
            const projectExists = await projet.findByPk(projet_id);
            if (!projectExists) {
                return res.status(404).json({ message: "Projet introuvable." });
            }
        }

        if (equipe) {
            const users = await utilisateur.findAll({
                where: { nom_complet: equipe }
            });

            if (users.length === 0) {
                return res.status(404).json({ message: "Aucun utilisateur trouvé." });
            }

            await task.setUtilisateurs(users);
        }

        if (date_de_debut_tache && date_de_fin_tache && new Date(date_de_debut_tache) >= new Date(date_de_fin_tache)) {
            return res.status(400).json({ message: "La date de début doit être antérieure à la date de fin." });
        }

        Object.assign(task, {
            titre,
            statut,
            date_de_debut_tache,
            date_de_fin_tache,
            poids,
            projet_id,
        });

        await task.save();

        res.status(200).json({ message: "Tâche mise à jour avec succès.", task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};


const deleteTask = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "L'ID de la tâche est requis dans l'URL." });
    }

    try {
        const task = await tache.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: "Tâche introuvable." });
        }

        await tache_projet.destroy({
            where:{ tache_id: id }
        });

        await tache_utilisateur.destroy({
            where: { tache_id : id }
        });

        await task.destroy();

        res.status(200).json({ message: "Tâche supprimée avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};

module.exports = {
    createTask,
    updateTask,
    deleteTask,
};