"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */
// diger route lar

// auth:
router.use('/auth', require('./auth'))

// user:
router.use('/users', require('./user'))

// token:
router.use('/tokens', require('./token'))

// category
router.use('/categories', require('./category'))

// type
router.use('/types', require('./type'))

// product
router.use('/products', require('./product'))

// firm
router.use('/firms', require('./firm'))

// log
router.use('logs', require('./log'));

// document: API icin gorsel dokuman
router.use('/documents', require('./document'))

/* ------------------------------------------------------- */
module.exports = router