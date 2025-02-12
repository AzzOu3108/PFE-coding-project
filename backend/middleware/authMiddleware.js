const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const isAuthenticated = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authentification requise' });
    }

    try {
        const tokenValue = token.replace('Bearer ', '').trim();
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

        // Verify user still exists in database
        const user = await utilisateur.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur invalide' });
        }

        // Attach essential user data to request
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        console.error('Authentication Error:', error.message);
        
        // Client-friendly messages
        const message = error.name === 'TokenExpiredError' 
            ? 'Token expiré' 
            : 'Token invalide';
            
        res.status(401).json({ message });
    }
};

module.exports = isAuthenticated