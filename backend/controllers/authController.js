const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { utilisateur, refreshtoken } = require('../models')
const generateToken = require('../utils/generateToken');
const { where } = require('sequelize');

const login = async (req, res) =>{
    const { adresse_email, mot_de_passe } = req.body
    try {
        const user = await utilisateur.findOne({where: {adresse_email}});
        if(!user) return res.status(401).json({ message: 'Email ou mot de passe invalide'});

        const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if(!isMatch) return res.status(401).json({ message: 'Email ou mot de passe invalide'});

        const accessToken = generateToken(user.id, user.role_id, 'access');
        const refreshToken = generateToken(user.id, user.role_id, 'refresh');

        await refreshtoken.upsert({ userId: user.id, token: refreshToken });
        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." , error });
    }
};

const refreshToken = async (req, res) =>{
    const { refreshToken } = req.body
    if(!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

    try {
        const storedToken = await refreshtoken.findOne({ where: {token: refreshToken}});
        if(!storedToken) return res.status(403).json({ message: 'Invalid refresh token' });

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = generateToken(decoded.id, decoded.role, 'access')

        res.json({accessToken: newAccessToken})
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." , error });
    }
};

const logout = async (req, res) =>{
    try {
        await refreshtoken.destroy({where: {utilisateur_id: req.user.id} })
        res.json({ message: 'Déconnecté avec succès' });
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." , error });
    }
};


module.exports = { login, refreshToken, logout }