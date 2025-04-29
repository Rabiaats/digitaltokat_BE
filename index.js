"use strict"

// express.js
const express = require('express');
const app = express();

// .env
require('dotenv').config();
const PORT = process.env?.PORT || 8000;
const HOST = process.env?.HOST || '127.0.0.1';

// async-error catch
require('express-async-errors');

// connect to db

// json veriler ve form
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// cors -> su anlik hepsine izin ver
app.use(require('cors')());

// upload - middleware eklenecek (authentication - logger - queryHandler) -> errorHandler app.listen in ustune eklenecek

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

// run server
app.listen(PORT, HOST, () => console.log(`http://${HOST}:${PORT}`))