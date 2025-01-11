const { where } = require('sequelize');
const utilisateur = require('../models/users')
const bcrypt = require('bcryptjs')

const getAllUser = async (req, res) => {
    try {
        const users = await utilisateur.findAll(); 
        if (!users.length) { 
            return res.status(400).json({ message: "Il n'y a pas d'utilisateurs" });
        }
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};


const getUserByName = async (req, res) => {
    const { nom_complet } = req.body;

    if (!nom_complet || !nom_complet.trim()) {
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


const createNewUser = async(req, res) =>{
    const { matricule, nom_complet, adresse_email, mot_de_passe, numero_telephone, departement } = req.body

    if (!matricule ||!nom_complet ||!adresse_email ||!mot_de_passe ||!numero_telephone ||!departement){
        return res.status(400).json({message: 'Veuillez saisir toutes les informations'})
    } 
    try {
        const existingUser = await utilisateur.findOne({ where: { matricule, adresse_email } });

        if(existingUser){
            return res.status(409).json({message:'Essayer avec un nouveau email'})
        }

        const hashpwd = await bcrypt.hash(mot_de_passe, 10)
        
        const newUser = await utilisateur.create({
            matricule,
            nom_complet,
            adresse_email,
            mot_de_passe : hashpwd,
            numero_telephone,
            departement,
            role_id: 1 // Default role: Utilisateur
        })

        return res.status(201).json({
            message: 'Utilisateur créé avec succès',
            utilisateur: newUser
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

const updateUserRole = async (req, res) =>{
    // const {id} = req.params
    const {role_id} = req.body

    if(!role_id){
        return res.status(400).json({message:"L'ID du rôle est requis"})
    }

    try {
        const user = await utilisateur.findOne({ where: {utilisateur_id: id}})

        if(!user){
            return res.status(400).json({message: 'Utilisateur non trouvé'})
        }
        user.role_id = role_id
        await user.save()
        res.status(200).json({ message: 'Rôle mis à jour avec succès' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

const updateUser = async (req, res) =>{
    // use ID from the "auth middleware" here in middleware implementation
    // const utilisateur_id = req.user.id;
    const { id, matricule, nom_complet, adresse_email, mot_de_passe, numero_telephone, departement } = req.body;

    if(! id){
        return res.status(400).json({message: "Utilisateur ID est requis"})
    }
    try {
        console.log(`Recherche de l'utilisateur avec ID: ${id}`);
        const user = await utilisateur.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        if(matricule) user.matricule = matricule;
        if (nom_complet) user.nom_complet = nom_complet;
        if (adresse_email) user.adresse_email = adresse_email;
        if (mot_de_passe) {
            user.mot_de_passe = await bcrypt.hash(mot_de_passe, 10);
        }
        if (numero_telephone) user.numero_telephone = numero_telephone;
        if (departement) user.departement = departement;
    
        await user.save();
    
        res.status(200).json({ message: 'Profil mis à jour avec succès' }); 
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Erreur du serveur' });
    } 
};


const deleteUser = async (req, res) =>{
    const {id} = req.params

    try {
        const user = await utilisateur.findOne({where:{id}})

        if(!user){
            return res.status(400).json({message: 'Utilisateur non trouvé'})
        }
        await user.destroy()
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.log(error)
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
}