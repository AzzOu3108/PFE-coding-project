const { where } = require('sequelize');
const role = require('../models/roles');
const bcrypt = require('bcryptjs');
const { tache_utilisateur, projet_utilisateur, utilisateur } = require('../models');

const getAllUser = async (req, res) => {
    try {
        const users = await utilisateur.findAll();
        if (!users.length) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé" });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

const getUserByName = async (req, res) => {
    const { nom_complet } = req.query;

    if (!nom_complet) {
        return res.status(400).json({ message: "Entrez le nom complet d'utilisateur" });
    }

    try {
        const user = await utilisateur.findOne({ where: { nom_complet } });
        if (!user) {
            return res.status(404).json({ message: "Il n'y a pas d'utilisateur" });
        }
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

const createNewUser = async (req, res) => {
    const { matricule, nom_complet, adresse_email, mot_de_passe, numero_telephone, departement } = req.body;

    if (!matricule || !nom_complet || !adresse_email || !mot_de_passe || !numero_telephone || !departement) {
        return res.status(400).json({ message: 'Veuillez fournir toutes les informations' });
    }

    try {
        const existingMatricule = await utilisateur.findOne({ where: { matricule } });
        if (existingMatricule) {
            return res.status(409).json({ message: 'Matricule déjà utilisé' });
        }

        const existingEmail = await utilisateur.findOne({ where: { adresse_email } });
        if (existingEmail) {
            return res.status(409).json({ message: 'Adresse email déjà utilisée' });
        }

        const hashpwd = await bcrypt.hash(mot_de_passe, 10);

        const encodedName = encodeURIComponent(nom_complet);
        const profile_pic = `https://avatar.iran.liara.run/username?username=${encodedName}`;

        const newUser = await utilisateur.create({
            matricule,
            nom_complet,
            adresse_email,
            mot_de_passe: hashpwd,
            numero_telephone,
            departement,
            role_id: 1, // Default role: Utilisateur
            photo_de_profil: profile_pic
        });

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            utilisateur: newUser
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role_id } = req.body;

    if (!role_id) {
        return res.status(400).json({ message: "L'ID du rôle est requis" });
    } else if (!id){
        return res.status(400).json({message: "L'ID est requis"})
    }

    try {
        const user = await utilisateur.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        const roleExists = await role.findByPk(role_id);
        if (!roleExists) {
            return res.status(400).json({ message: 'Rôle invalide' });
        }

        user.role_id = role_id;
        await user.save();
        res.status(200).json({ message: 'Rôle mis à jour avec succès' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

const updateUser = async (req, res) => {
    const id = req.params
    const {matricule, nom_complet, adresse_email, mot_de_passe, numero_telephone, departement } = req.body;

    if (!id) {
        return res.status(400).json({ message: "L'ID de l'utilisateur est requis" });
    }

    try {
        const user = await utilisateur.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        if (matricule) user.matricule = matricule;
        if (nom_complet) user.nom_complet = nom_complet;
        if (adresse_email) user.adresse_email = adresse_email;
        if (mot_de_passe) user.mot_de_passe = await bcrypt.hash(mot_de_passe, 10);
        if (numero_telephone) user.numero_telephone = numero_telephone;
        if (departement) user.departement = departement;

        await user.save();

        res.status(200).json({ message: 'Profil mis à jour avec succès' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await utilisateur.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        await tache_utilisateur.destroy({
            where: { utilisateur_id: id }
        });

        await projet_utilisateur.destroy({
            where: { utilisateur_id: id }
        })

        await user.destroy();
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

module.exports = {
    getAllUser,
    getUserByName,
    createNewUser,
    updateUserRole,
    updateUser,
    deleteUser
};
