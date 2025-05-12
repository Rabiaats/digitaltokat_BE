"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */

const {list, create, read, update, deletee} = require('../controllers/firm');

const {isSuperAdmin, isFirmOrSuperAdmin} = require('../middlewares/permissions');

router.route('/')
    .get(list)
    .post(isSuperAdmin,create)

router.route('/:id')
    .get(read)
    .put(isFirmOrSuperAdmin, update)
    .patch(isFirmOrSuperAdmin, update)
    .delete(isFirmOrSuperAdmin, deletee)

module.exports = router;