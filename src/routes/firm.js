"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */

const {list, create, read, update, deletee, requestAccountRemoval} = require('../controllers/firm');

const {isAdmin, isStaffOrAdmin, isStaff} = require('../middlewares/permissions');
const upload = require('../middlewares/upload');

router.route('/')
    .get(list)
    .post(isAdmin, upload.array('image'),create)

router.route('/:id')
    .get(read)
    .put(isStaffOrAdmin, upload.array('image'), update)
    .patch(isStaffOrAdmin, upload.array('image'), update)
    .delete(isAdmin, deletee)


router.delete("/request-removel/:id", isStaff, requestAccountRemoval)

module.exports = router;