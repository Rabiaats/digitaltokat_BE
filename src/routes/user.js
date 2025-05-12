"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */

const {list, create, read, update, deletee} = require('../controllers/user');

const {isSuperAdmin, isFirmOrSuperAdmin} = require('../middlewares/permissions');

router.route('/')
    .get(isSuperAdmin, list)
    .post(isSuperAdmin, create)

router.use(isFirmOrSuperAdmin)
router.route('/:id')
    .get(read)
    .put(update)
    .patch(update)
    .delete(deletee)

module.exports = router;