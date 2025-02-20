const validateProjectExiste = require("../middleware/validateProjectExiste");
const { tache, projet, utilisateur, tache_utilisateur, tache_projet } = require("../models");


const createTask = async (req, res) => {
    const projet_id = req.project.id;
    const { titre, equipe, statut, date_de_debut_tache, date_de_fin_tache, poids } = req.body;

    if (!titre || !equipe || !statut || !date_de_debut_tache || !date_de_fin_tache || !poids) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs." });
    }

    if (new Date(date_de_debut_tache) >= new Date(date_de_fin_tache)) {
        return res.status(400).json({ message: "La date de début doit être antérieure à la date de fin." });
    }

    try {
        // Authorization check
        if (req.user.role === 'Chef de Projet') {
            const isLead = await verifyProjectLeadership(req.user.id, projet_id);
            if (!isLead) {
                return res.status(403).json({ message: "Vous n'êtes pas responsable de ce projet" });
            }
        }

        // Existing task check
        const existingtask = await tache.findOne({ where: { titre } });
        if (existingtask) {
            return res.status(409).json({ message: "La tâche existe déjà" });
        }

        // User validation
        const users = await utilisateur.findAll({ where: { nom_complet: equipe } });
        if (users.length !== equipe.length) {
            return res.status(404).json({ message: "Un ou plusieurs utilisateurs n'existent pas" });
        }

        // Create task
        const newTask = await tache.create({
            titre,
            statut,
            date_de_debut_tache,
            date_de_fin_tache,
            poids
        });

        // Create associations
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
            equipe: users.map(user => user.nom_complet)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};


const updateTask = async (req, res) => {
        const { id } = req.params;
        const { titre, equipe, date_de_debut_tache, date_de_fin_tache, poids, projet_id } = req.body;
    
        try {
            if (!id) {
                return res.status(400).json({ message: "L'ID de la tâche est requis." });
            }
    
            const currentUserRole = req.user.role;
    
            const task = await tache.findByPk(id, {
                include: [{
                    model: utilisateur,
                    as: 'utilisateurs',
                    through: { attributes: [] }
                }]
            });
    
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
                const teamMembers = Array.isArray(equipe) ? equipe : [equipe];
    
                const users = await utilisateur.findAll({
                    where: { nom_complet: equipe }
                });
    
                if (users.length !== teamMembers.length) {
                    const missingUsers = teamMembers.filter(id =>
                        !users.some(user => user.id === id)
                    );
                    return res.status(404).json({ message: `Utilisateurs non trouvés: ${missingUsers.join(', ')}` });
                }
    
                if (currentUserRole === 'Chef de Projet') {
                    const isProjetLead = await verifyProjectLeadership(req.user.id, task.projet_id);
                    if (!isProjetLead) {
                        return res.status(403).json({ message: "Vous n'êtes pas responsable de ce projet." });
                    }
                }
    
                await task.setUtilisateurs(users);
            }
    
            if (date_de_debut_tache && date_de_fin_tache && new Date(date_de_debut_tache) >= new Date(date_de_fin_tache)) {
                return res.status(400).json({ message: "La date de début doit être antérieure à la date de fin." });
            }
    
            Object.assign(task, {
                titre,
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


const updateTasksStatus = async (req, res) => {
        const { id } = req.params;
        const { statut } = req.body;
    
        try {
            
            if (!id) {
                return res.status(400).json({ message: "L'ID de la tâche est requis." });
            }
    
            if (!statut) {
                return res.status(400).json({ message: "Le statut est requis." });
            }

            const validStatuses = ['A faire', 'En cours', 'Terminée', 'En attente', 'Annulée'];
            if (!validStatuses.includes(statut)) {
                return res.status(400).json({ 
                    message: "Statut de tâche non valide.",
                    validStatuses: validStatuses
                });
            }

            const task = await tache.findByPk(id);
            if (!task) {
                return res.status(404).json({ message: "Tâche introuvable." });
            }
    
            const currentUserRole = req.user.role;
            if (currentUserRole === 'Utilisateur') {
                
                const isAssigned = await tache_utilisateur.findOne({
                    where: {
                        tache_id: id,
                        utilisateur_id: req.user.id
                    }
                });
    
                if (!isAssigned) {
                    return res.status(403).json({ 
                        message: "Vous n'êtes pas assigné à cette tâche." 
                    });
                }
            }
    
            task.statut = statut;
            await task.save();
    
            res.status(200).json({ 
                message: "Statut de la tâche mis à jour avec succès.",
                task 
            });
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
    updateTasksStatus,
    deleteTask,
};