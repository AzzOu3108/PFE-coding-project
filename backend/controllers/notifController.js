const { utilisateur, projet, tache, notification, notification_utilisateur } = require('../models');

const getNotifications = async (req, res) => {
    const userId = req.user.id;

    try {
        const notifications = await notification.findAll({
            include: [
                {
                    model: utilisateur,
                    as: 'utilisateurs',
                    attributes: ['nom_complet'],
                    through: {
                        model: notification_utilisateur,
                        where: { utilisateur_id: userId },
                        attributes: []
                    }
                },
                { model: projet, attributes: ['nom_de_projet'], as: 'projet' },
                { model: tache, attributes: ['titre'], as: 'tache' }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};

module.exports = { getNotifications };