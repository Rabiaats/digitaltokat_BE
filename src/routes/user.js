"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */

const {list, create, read, update, deletee} = require('../controllers/user');

const {isAdmin, isStaffOrAdmin} = require('../middlewares/permissions');

router.route('/')
    .get(isAdmin, list)
    .post(create)

router.use(isStaffOrAdmin)
router.route('/:id')
    .get(read)
    .put(update)
    .patch(update)
    .delete(deletee)

module.exports = router;