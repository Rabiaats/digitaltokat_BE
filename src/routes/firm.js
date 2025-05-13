"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */

const {list, create, read, update, deletee} = require('../controllers/firm');

const {isSuperAdmin, isFirmOrSuperAdmin} = require('../middlewares/permissions');
const upload = require('../middlewares/upload');

router.route('/')
    .get(list)
    .post(isSuperAdmin, upload.array('image'),create)

router.route('/:id')
    .get(read)
    .put(isFirmOrSuperAdmin, upload.array('image'), update)
    .patch(isFirmOrSuperAdmin, upload.array('image'), update)
    .delete(isFirmOrSuperAdmin, deletee)

module.exports = router;