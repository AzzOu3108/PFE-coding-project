const utilisateur = require('../models/users')
const bcrypt = require('bcryptjs')

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

        const newUser = await utilisateur.create({
            nom_complet,
            adresse_email,
            mot_de_passe,
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
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports = {
    createNewUser,
}