const {format} = require('date-fns')
const {v4:uuid} = require('uuid')

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const {connected} = require('process')

const logEvents = async (messsage, logFileName) =>{
    const dateTime = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`
    const logItems = `${dateTime}\t${uuid()}\t${messsage}\n`

    try {
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsPromises.mkdir(path.join(__dirname,'..','logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItems)
    } catch (error) {
        console.log(error)
    }
}

const logger = (req, res, next)=>{
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = {logEvents, logger}