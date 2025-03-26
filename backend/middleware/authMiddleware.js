const jwt = require('jsonwebtoken');
const {utilisateur, role} = require('../models')
require('dotenv').config()

const isAuthenticated = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authentification requise' });
    }
    try {
        const tokenValue = token.replace('Bearer ', '').trim();

        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

        const user = await utilisateur.findByPk(decoded.id, {
            include: [{
                model: role,
                as: 'role',
                attributes: ['role_name']
            }],
            attributes: ['id', 'nom_complet']
        })
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }
        if (!user.role) {
            return res.status(403).json({ message: "Problème d'autorisation" });
        }

        req.user = {
            id: user.id,
            role: user.role.role_name,
            nom_complet: user.nom_complet
        };

        next();
    } catch (error) {
        console.error('Authentication Error:', error.message);
        
        
        const message = error.name === 'TokenExpiredError' 
            ? 'Token expiré' 
            : 'Token invalide';
            
        res.status(401).json({ message });
    }
};

const isAuthorized = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Action non autorisée" });
        }
        next();
    };
};

module.exports = {isAuthenticated , isAuthorized}