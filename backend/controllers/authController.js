const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { utilisateur, refreshtoken } = require('../models')
const generateToken = require('../utils/generateToken')

const login = async (req, res) => {
    const { adresse_email, mot_de_passe } = req.body
    
    if (!adresse_email || !mot_de_passe) {
        return res.status(400).json({ message: 'Email et mot de passe requis' })
    }

    try {
        const user = await utilisateur.findOne({ where: { adresse_email } })
        if (!user) return res.status(401).json({ message: 'Email ou mot de passe invalide' })

        const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe)
        if (!isMatch) return res.status(401).json({ message: 'Email ou mot de passe invalide' })

        const accessToken = generateToken(user.id, user.role_id, 'access')
        const refreshToken = generateToken(user.id, user.role_id, 'refresh')

        await refreshtoken.upsert({
            utilisateur_id: user.id,
            token: refreshToken
        })

        res.json({ accessToken, refreshToken })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ message: "Erreur du serveur." })
    }
}

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token requis' })

    try {
        const storedToken = await refreshtoken.findOne({ 
            where: { token: refreshToken }
        })
        if (!storedToken) return res.status(403).json({ message: 'Refresh token invalide' })

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        
        const user = await utilisateur.findByPk(decoded.id)
        if (!user) return res.status(403).json({ message: 'Utilisateur non trouvé' })

        const newAccessToken = generateToken(user.id, user.role_id, 'access')
        res.json({ accessToken: newAccessToken })
    } catch (error) {
        console.error('Refresh token error:', error)
        res.status(500).json({ message: "Erreur du serveur." })
    }
}

const logout = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: "Utilisateur non trouvé." })
        }

        await refreshtoken.destroy({ 
            where: { utilisateur_id: req.user.id } 
        })
        
        res.json({ message: 'Déconnecté avec succès' })
    } catch (error) {
        console.error('Logout error:', error)
        res.status(500).json({ message: 'Erreur du serveur.' })
    }
}

module.exports = { login, refreshToken, logout }