const jwt = require('jsonwebtoken')
require('dotenv').config()

const generateToken = (id, role, type) => {

    const secret = type === 'access' ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET;
    const expiresIn = type === 'access' ? process.env.ACCESS_TOKEN_EXPIRATION : process.env.REFRESH_TOKEN_EXPIRATION;

    return jwt.sign({ id, role }, secret, { expiresIn });
};

module.exports = generateToken