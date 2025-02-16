const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Trop de tentatives de connexion, veuillez réessayer après 10 minutes',
    skipSuccessfulRequests: true 
});

const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100, 
    message: 'Trop de requêtes depuis cette adresse IP'
});

module.exports = { authLimiter, apiLimiter };