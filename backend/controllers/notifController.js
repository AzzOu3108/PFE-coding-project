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
                        attributes: [],
                    },
                    required: true
                },
                { model: projet, attributes: ['nom_de_projet'], as: 'projet' },
                { model: tache, attributes: ['titre'], as: 'tache' }
            ],
            order: [['createdAt', 'DESC']]
        });

        if (notifications.length === 0) {
            return res.status(404).json({ message: "Aucune notification trouvée." });
        }

        // Process the content to remove escapes
        const processedNotifications = notifications.map(notif => {
            const contenu = notif.contenu
                .replace(/\\"/g, '"')   // Replace \" with "
                .replace(/\\n/g, '\n'); // Replace \n with newline

            return {
                ...notif.toJSON(),
                contenu
            };
        });

        res.status(200).json({ notifications: processedNotifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};


const deleteNotification = async (req, res) => {
    
}

module.exports = { getNotifications };