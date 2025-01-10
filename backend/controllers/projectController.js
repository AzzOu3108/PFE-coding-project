const projet = require('../models/project')
const utilisateur = require('../models/users')
const { Op } = require('sequelize');

const getAllProjects = async (req, res) => {
    try {
        const projects = await projet.findAll();

        if (!projects.length) {
            return res.status(404).json({ message: "Aucun projet disponible." });
        }

        res.status(200).json({ projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};
//* i couldn't send query request in postman
const getProjectByName = async (req, res) => {
    const { nom_de_projet } = req.query;
    
    if (!nom_de_projet) {
        return res.status(400).json({ message: "Veuillez fournir un nom de projet." });
    }

    try {
        const project = await projet.findOne({
            where: { nom_de_projet: { [Op.iLike]: `%${nom_de_projet}%` } },
        });

        if (!project) {
            return res.status(404).json({ message: "Aucun projet correspondant." });
        }

        res.status(200).json({ project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};

const createProject = async (req, res) => {
    const {
        utilisateur_id, nom_complet, numero_telephone_utilisateur, function_de_projet,
        departement, nom_programme, sponsor_de_programme, manager_de_projet,
        nom_de_projet, controle_des_couts, description, objective, date_de_debut,
        date_de_fin, buget_global
    } = req.body;

    if (!utilisateur_id || !nom_complet || !numero_telephone_utilisateur || !function_de_projet ||
        !departement || !nom_programme || !sponsor_de_programme || !manager_de_projet ||
        !nom_de_projet || !controle_des_couts || !description || !objective || !date_de_debut ||
        !date_de_fin || !buget_global) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs." });
    }

    if (new Date(date_de_debut) >= new Date(date_de_fin)) {
        return res.status(400).json({ message: "La date de début doit être antérieure à la date de fin." });
    }

    try {
        const existingUser = await utilisateur.findByPk(utilisateur_id);

        if (!existingUser) {
            return res.status(404).json({ message: "L'utilisateur avec cet ID n'existe pas." });
        }

        const existingProject = await projet.findOne({ where: { nom_de_projet } });

        if (existingProject) {
            return res.status(409).json({ message: "Ce projet existe déjà." });
        }

        const newProject = await projet.create({
            utilisateur_id, nom_complet, numero_telephone_utilisateur, function_de_projet,
            departement, nom_programme, sponsor_de_programme, manager_de_projet,
            nom_de_projet, controle_des_couts, description, objective, date_de_debut,
            date_de_fin, buget_global
        });

        res.status(201).json({ message: "Projet créé avec succès.", newProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};

//*TODO req.params mrahich joz
const updateProject = async (req, res) => {
    const {
        utilisateur_id, nom_complet, numero_telephone_utilisateur, function_de_projet,
        departement, nom_programme, sponsor_de_programme, manager_de_projet,
        nom_de_projet, controle_des_couts, description, objective, date_de_debut,
        date_de_fin, buget_global
    } = req.body;

    const { project_id } = req.params;

    if (!project_id) {
        return res.status(400).json({ message: "L'ID du projet est requis dans l'URL." });
    }

    try {
        const project = await projet.findByPk(project_id);

        if (!project) {
            return res.status(404).json({ message: "Projet introuvable." });
        }

        if (utilisateur_id) {
            const userExists = await utilisateur.findByPk(utilisateur_id);
            if (!userExists) {
                return res.status(404).json({ message: "Utilisateur introuvable." });
            }
        }

        if (date_de_debut && date_de_fin && new Date(date_de_debut) >= new Date(date_de_fin)) {
            return res.status(400).json({ message: "La date de début doit être antérieure à la date de fin." });
        }

        Object.assign(project, {
            utilisateur_id, 
            nom_complet, 
            numero_telephone_utilisateur,
            function_de_projet,
            departement,
            nom_programme, 
            sponsor_de_programme,
            manager_de_projet,
            nom_de_projet, 
            controle_des_couts, 
            description, 
            objective, 
            date_de_debut,
            date_de_fin, 
            buget_global
        });

        await project.save();

        res.status(200).json({ message: "Projet mis à jour avec succès.", project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};


const deleteProject = async (req, res) => {
    const { nom_de_projet } = req.body;

    if (!nom_de_projet) {
        return res.status(400).json({ message: "Veuillez fournir le nom du projet à supprimer." });
    }

    try {
        const project = await projet.findOne({ where: { nom_de_projet } });

        if (!project) {
            return res.status(404).json({ message: "Projet introuvable." });
        }

        await project.destroy();

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