"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */
// diger route lar


// document: API icin gorsel dokuman
router.use('/documents', require('./document'))

/* ------------------------------------------------------- */
module.exports = router