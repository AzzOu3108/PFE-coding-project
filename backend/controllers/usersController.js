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


const getUser = async(req, res) =>{
    const {nom_complet} = req.body

    if(!nom_complet.length){
        return res.status(400).json({message: "Enter le nom complet d'utilisateur"})
    }
    try {
        const user = await findOne({where:{nom_complet}})
        if(!user){
            res.status(404).json({message: "Il n'y a pas d'utilisateur"})
        }
        res.json({user})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};


const createNewUser = async(req, res) =>{
    const { nom_complet, adresse_email, mot_de_passe, numero_telephone, departement } = req.body

    if (!nom_complet ||!adresse_email ||!mot_de_passe ||!numero_telephone ||!departement){
        return res.status(400).json({message: 'Veuillez saisir toutes les informations'})
    }
    try {
        const existingUser = await utilisateur.findOne({ where: { adresse_email } });

        if(existingUser){
            return res.status(409).json({message:'Essayer avec un nouveau email'})
        }

        const hashpwd = await bcrypt.hash(mot_de_passe, 10)

        const newUser = await utilisateur.create({
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
}

const updateUser = async (req, res) =>{
    
};


const deleteUser = async (req, res) =>{

};


module.exports = {
    getAllUser,
    getUser,
    createNewUser,
    updateUser,
    deleteUser
}