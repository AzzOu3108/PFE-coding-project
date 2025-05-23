require('dotenv').config();
const express = require('express')
const app = express()
const sequelize = require('./config/DB')
const path = require('path')
const {logger} = require('./middleware/logger')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const {apiLimiter} = require('./middleware/rateLimiter')
const PORT = process.env.PORT || 8000

app.use(apiLimiter)

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use('/auth', require('./routes/authRouter'))
app.use('/utilisateur', require('./routes/userRoutes'))
app.use('/projet', require('./routes/projectRouter'))
app.use('/tache', require('./routes/taskRouter'))
app.use('/notification', require('./routes/notifRouter'))

app.get('^/home$|^/$', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the homepage!',
        data: {
            title: 'Homepage',
            description: 'This is the homepage content.',
        },
    });
});

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.json({ 
            error: '404 Not Found', 
            message: `The route ${req.originalUrl} does not exist.` 
        });
    } else if (req.accepts('json')) {
        res.json({ 
            message: '404 Not Found' 
        });
    } else {
        res.type('txt').send('404 Not Found');
    }
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
        
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
