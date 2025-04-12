const { tache, projet, utilisateur, tache_utilisateur, tache_projet, notification,  } = require("../models");
const { sendEmail } = require('../config/emailConfig');
const notification_utilisateur = require("../models/notification_utilisateur");
//* export notification_utilisateur mn l model ida mmchatch

const pendingTasks = {};

const createTask = async (req, res) => {
    const projet_id = req.project.id;
    const { titre, equipe, statut, date_de_debut_tache, date_de_fin_tache, poids, finalize } = req.body;

    if (!titre || !equipe || !statut || !date_de_debut_tache || !date_de_fin_tache || !poids) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs." });
    }

    const allowedRoles = ['chef de projet', 'administrateur'];
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Vous n'avez pas la permission de mettre à jour cette tâche." });
    }

    if (equipe.length === 0) {
        return res.status(400).json({ message: "Vous devez assigner la tâche à au moins un utilisateur." });
    }

    if (new Date(date_de_debut_tache) >= new Date(date_de_fin_tache)) {
        return res.status(400).json({ message: "La date de début doit être antérieure à la date de fin." });
    }

    if (poids < 0 || poids > 100){
        return res.status(400).json({ message: "Le poids doit être compris entre 0 et 100." });
    }

    try {
        const existingTask = await tache.findOne({
            where: { titre },
            include: [{
                model: projet,
                where: { id: projet_id },
                as: 'projets'
            }]
        });
        
        if (existingTask) {
            return res.status(409).json({ message: "La tâche existe déjà" });
        }

        const users = await utilisateur.findAll({ where: { nom_complet: equipe },
            attributes: ['id', 'nom_complet', 'adresse_email']
        });
        
        if (users.length !== equipe.length) {
            const missingUsers = equipe.filter(userName =>
                !users.some(user => user.nom_complet === userName)
            );
            return res.status(404).json({ message: `Utilisateurs non trouvés: ${missingUsers.join(', ')}` });
        }

        
        if (!finalize) {
            if (!pendingTasks[projet_id]) {
                pendingTasks[projet_id] = [];
            }
            pendingTasks[projet_id].push({
                titre,
                statut,
                date_de_debut_tache,
                date_de_fin_tache,
                poids,
                created_by: req.user.id,
                users
            });
            return res.status(200).json({ message: "Tâche en attente de finalisation" });
        }

        // If finalizing, create all tasks and send one notification
        if (finalize) {
            const tasksToCreate = pendingTasks[projet_id] || [];
            tasksToCreate.push({
                titre,
                statut,
                date_de_debut_tache,
                date_de_fin_tache,
                poids,
                created_by: req.user.id,
                users
            });

            const createdTasks = [];
            const allUsers = new Set();


            for (const taskData of tasksToCreate) {
                const newTask = await tache.create({
                    titre: taskData.titre,
                    statut: taskData.statut,
                    date_de_debut_tache: taskData.date_de_debut_tache,
                    date_de_fin_tache: taskData.date_de_fin_tache,
                    poids: taskData.poids,
                    created_by: taskData.created_by
                });

                await tache_projet.create({ tache_id: newTask.id, projet_id });
                await newTask.addUtilisateurs(taskData.users);
                createdTasks.push(newTask);
                taskData.users.forEach(user => allUsers.add(user));
            }

            
            const taskList = tasksToCreate.map(task => `- ${task.titre}`).join(' ');
            const notificationMessage = `Le Chef de Projet ${req.user.nom_complet} a créé le projet ${req.project.nom_de_projet} et vous a attribué les tâches suivantes : ${taskList}`;

            // Send notifications to all users
            for (const user of allUsers) {
                const newNotification = await notification.create({
                    contenu: notificationMessage,
                    projet_id,
                    tache_id: createdTasks[0].id // Use first task ID as reference
                });
                await notification_utilisateur.create({
                    notification_id: newNotification.id,
                    utilisateur_id: user.id
                });
                await sendEmail(user.adresse_email, 'Nouveau projet créé', notificationMessage);
            }

            delete pendingTasks[projet_id];
            return res.status(201).json({
                message: "Tâches créées avec succès",
                tasks: createdTasks.map(task => ({
                    id: task.id,
                    titre: task.titre,
                    statut: task.statut,
                    date_de_debut_tache: task.date_de_debut_tache,
                    date_de_fin_tache: task.date_de_fin_tache,
                    poids: task.poids,
                    created_by: task.created_by,
                    utilisateurs: tasksToCreate.find(t => t.titre === task.titre).users.map(user => ({
                        id: user.id,
                        nom_complet: user.nom_complet,
                        adresse_email: user.adresse_email
                    }))
                }))
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};


const updateTask = async (req, res) => {
    const { id, projectId } = req.params;
    const { titre, equipe, date_de_debut_tache, date_de_fin_tache, poids } = req.body;

    try {
        if (!id || !projectId) {
            return res.status(400).json({ message: "L'ID de la tâche et du projet sont requis." });
        }

        const allowedRoles = ['chef de projet', 'administrateur'];
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Vous n'avez pas la permission de mettre à jour cette tâche." });
        }

        const project = await projet.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: "Projet introuvable." });
        }

        const task = await tache.findByPk(id, {
            include: [
                {
                    model: utilisateur,
                    as: 'utilisateurs',
                    through: { attributes: [] }
                },
                {
                    model: projet,
                    as: 'projets'
                }
            ]
        });

        if (!task) {
            return res.status(404).json({ message: "Tâche introuvable." });
        }

        if (equipe) {
            if (equipe.length === 0) {
                if (task.utilisateurs.length === 0) {
                    await tache_projet.destroy({ where: { tache_id: id } });
                    await task.destroy();

                    const remainingTasks = await tache_projet.count({ where: { projet_id: projectId } });
                    if (remainingTasks === 0) {
                        await projet.destroy({ where: { id: projectId } });
                        return res.status(200).json({ message: "Tâche et projet supprimés car il n'y a plus de tâches." });
                    }
                    return res.status(200).json({ message: "Tâche supprimée car il n'y a plus d'utilisateurs." });
                } else {
                    return res.status(400).json({ message: "Vous devez assigner la tâche à au moins un utilisateur." });
                }
            }

            const users = await utilisateur.findAll({ where: { nom_complet: equipe } });
            const missingUsers = equipe.filter(userName =>
                !users.some(user => user.nom_complet === userName)
            );

            if (missingUsers.length > 0) {
                return res.status(404).json({ message: `Utilisateurs non trouvés: ${missingUsers.join(', ')}` });
            }

            await task.setUtilisateurs(users);
        }

        if (date_de_debut_tache && date_de_fin_tache && new Date(date_de_debut_tache) >= new Date(date_de_fin_tache)) {
            return res.status(400).json({ message: "La date de début doit être antérieure à la date de fin." });
        }

        // Update task properties
        Object.assign(task, {
            titre,
            date_de_debut_tache,
            date_de_fin_tache,
            poids,
            projet_id: projectId,
        });

        await task.save();

        const assignedUsers = await task.getUtilisateurs();
        const equipeNames = assignedUsers.map(user => user.nom_complet);

        const updatedTaskData = {
            id: task.id,
            titre: task.titre,
            date_de_debut_tache: task.date_de_debut_tache,
            date_de_fin_tache: task.date_de_fin_tache,
            poids: task.poids,
            
        };

        return res.status(200).json({
            message: "Tâche mise à jour avec succès.",
            task: updatedTaskData,
            equipe: equipeNames
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la tâche:", error);
        return res.status(500).json({ message: "Erreur du serveur." });
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

        const notifications = await notification.findAll({
            where: { tache_id: id }
        });

        const notificationIds = notifications.map(n => n.id);
        await notification_utilisateur.destroy({
            where: {
                notification_id: notificationIds
            }
        });

        await notification.destroy({
            where: { tache_id: id }
        });

        await tache_projet.destroy({
            where: { tache_id: id }
        });

        await tache_utilisateur.destroy({
            where: { tache_id: id }
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