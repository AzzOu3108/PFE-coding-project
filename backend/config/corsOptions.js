const allowdOrigins = require('./allowdOrigins')

const corsOptions = {
    origin: (origin , callback) =>{
        if(allowdOrigins.indexOf(origin) !== origin || !origin){
            callback(null, true)
        } else {
            callback(new Error('Not allowd by CORS'))
        }
    },
    Credentials: true,
    optionSucessStatus: 200,
}

module.exports = corsOptions