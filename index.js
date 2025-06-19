"use strict"

// express.js
const express = require('express');
const app = express();
const cors = require("cors");

// .env
require('dotenv').config();
const PORT = process.env?.PORT || 8000;
const HOST = process.env?.HOST || '127.0.0.1';

// async-error catch
require('express-async-errors');

// connect to db
const { dbConnection } = require('./src/configs/dbConnection')
dbConnection();

// json veriler ve form
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// cors -> su anlik hepsine izin ver
app.use(cors());

// upload - middleware eklenecek (authentication - logger - queryHandler) -> errorHandler app.listen in ustune eklenecek

// Call static uploadFile:
app.use('/upload', express.static('./upload'))

// Check Authentication:
app.use(require('./src/middlewares/authentication'))

// Run Logger:
app.use(require('./src/middlewares/logger'))

// res.getModelList():
app.use(require('./src/middlewares/queryHandler'))

// homepath
app.all('/', (req, res) => {
    res.send({
        error: false,
        message: 'Welcome to Digital Tokat API',
        documents: {
            swagger: '/documents/swagger',
            redoc: '/documents/redoc',
            json: '/documents/json',
        },
        user: req.user
    })
});

// routes -> genel bir index.js route u
app.use(require('./src/routes'))

// notfound
app.all('*', (req, res) => {
    
    res.status(404).send({
        error: true,
        message: 'Route is not found!'
    })
})

// errorHandler middleware
app.use(require('./src/middlewares/errorHandler'))

// run server
app.listen(PORT, HOST, () => console.log(`http://${PORT}`))

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')() // !!! It clear database.