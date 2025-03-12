const { where } = require('sequelize');
const { utilisateur, projet, tache } = require('../models');

const getNotifications = async (req, res) => {
    const userId = req.user.id;

    try {
        const notification = await notification.findAll({
            where: {userId},
            order: [['createdAt', 'DESC']],
            include: [
                {model: utilisateur, attributes: ['nom_complet'], as: 'utilisateurs'},
                {model: projet, attributes: ['nom_projet'], as: 'projet'},
                {model: tache, attributes: ['titre'], as: 'tache'}
            ]
        });
        res.status(200).json({notification});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
        
    }
};

module.exports = { getNotifications };