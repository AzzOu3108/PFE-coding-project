const { projet, tache, projet_utilisateur, tache_projet, utilisateur, tache_utilisateur } = require("../models");

const getAllProjects = async (req, res) => {
    try {
        const allowRoles = ['administrateur', 'directeur'];
        const isUtilisateur = req.user && req.user.role === 'utilisateur';

        const includeUser = {
            model: utilisateur,
            through: { attributes: [] },
            as: 'utilisateurs',
            attributes: ['nom_complet'],
            ...(req.user && req.user.role && !allowRoles.includes(req.user.role))
                ? { where: { id: req.user.id } }
                : {}    
        };

        const projects = await projet.findAll({
            include: [
                includeUser,
                
                {
                    model: tache,
                    through: { attributes: [] }, 
                    as: 'taches',
                    attributes: ['titre', 'statut', 'date_de_debut_tache', 'date_de_fin_tache', 'poids'],
                    include: [{
                        model: utilisateur,
                        through: { attributes: [] }, 
                        as: "utilisateurs",
                        attributes: ['nom_complet'],
                    }],
                },
            ],
        });

        const Projets = projects.map(project => ({
            ...project.toJSON(),
            taches: project.taches.map(task => ({
                ...task.toJSON(),
                equipe: task.utilisateurs.map(user => user.nom_complet),
                utilisateurs: undefined,
            }))
        }));

        if (!projects.length) {
            return res.status(404).json({ message: "Aucun projet disponible." });
        }

        res.status(200).json({ Projets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};


const getProjectByName = async (req, res) => {
    const { nom_de_projet } = req.query;

    if (!nom_de_projet) {
        return res.status(400).json({ message: "Veuillez fournir un nom de projet." });
    }

    try {
        const project = await projet.findOne({
            where: { nom_de_projet },
            include: [
                {
                    model: tache,
                    through: { attributes: [] },
                    as: 'taches',
                    attributes: ['titre', 'statut', 'date_de_debut_tache', 'date_de_fin_tache', 'poids'],
                    include: [{
                        model: utilisateur,
                        through: { attributes: [] },
                        as: "utilisateurs", 
                        attributes: ['nom_complet']
                    }],
                },
            ],
        });

        if (!project) {
            return res.status(404).json({ message: "Aucun projet correspondant." });
        }

       
        const Projet = {
            ...project.toJSON(),
            taches: project.taches.map(task => ({
                ...task.toJSON(),
                equipe: task.utilisateurs.map(user => user.nom_complet), 
                utilisateurs: undefined, 
            }))
        };

        res.status(200).json({ Projet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};


const createProject = async (req, res) => {
    
    const {
        function_de_projet,
        nom_de_projet,
        nom_programme,
        sponsor_de_programme,
        manager_de_projet,
        controle_des_couts,
        description,
        objective,
        date_de_debut,
        date_de_fin,
        buget_global,
    } = req.body;

    if (!nom_de_projet || 
        !function_de_projet || 
        !nom_programme ||
        !sponsor_de_programme ||
        !manager_de_projet ||  
        !description || 
        !objective || 
        !date_de_debut || 
        !date_de_fin || 
        !buget_global
    ) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires." });
    }

    if (new Date(date_de_debut) >= new Date(date_de_fin)) {
        return res.status(400).json({ message: "La date de début doit être antérieure à la date de fin." });
    }

    try {
        
        const existingProject = await projet.findOne({ where: { nom_de_projet } });
        if (existingProject) {
            return res.status(409).json({ message: "Ce projet existe déjà." });
        }

        const newProject = await projet.create({
            function_de_projet,
            nom_programme,
            sponsor_de_programme,
            manager_de_projet,
            nom_de_projet,
            controle_des_couts,
            description,
            objective,
            date_de_debut,
            date_de_fin,
            buget_global,
           
        });

        await projet_utilisateur.create({
            projet_id: newProject.id,
            utilisateur_id: req.user.id
        })

        res.status(201).json({ message: "Projet créé avec succès.", newProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};

const updateProject = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
        return res.status(400).json({ message: "L'ID du projet est requis dans l'URL." });
    }

    try {
        const project = await projet.findByPk(id);

        if (!project) {
            return res.status(404).json({ message: "Projet introuvable." });
        }

        Object.assign(project, updateData);

        await project.save();

        res.status(200).json({ message: "Projet mis à jour avec succès.", project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};

// TODO: Extracting req.userId from Token ki tlha9 l auth and Authorization
const deleteProject = async (req, res) => {
    const { id } = req.params;
    const { utilisateur_id } = req.body;

    try {
        const userProject = await projet_utilisateur.findOne({
            where: {
                utilisateur_id: utilisateur_id,
                projet_id: id
            }
        });

        if (!userProject) {
            return res.status(404).json({ message: "Projet introuvable ou vous n'avez pas la permission de supprimer ce projet." });
        }

        const taskIds = await tache_projet.findAll({
            where: { projet_id: id },
            attributes: ['tache_id']
        });

        const tasksToDelete = taskIds.map(task => task.tache_id);

        await tache_projet.destroy({
            where: { projet_id: id }
        });

        await tache_utilisateur.destroy({
            where: { tache_id: tasksToDelete }
        });

        await tache.destroy({
            where: { id: tasksToDelete }
        });

        await projet_utilisateur.destroy({
            where: { projet_id: id }
        });

        await projet.destroy({
            where: { id: id }
        });

        res.status(200).json({ message: "Projet supprimé avec succès." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};


module.exports = {
    getAllProjects,
    getProjectByName,
    createProject,
    updateProject,
    deleteProject
};