"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */

const {list, create, read, update, deletee} = require('../controllers/product');

const {isFirmOrSuperAdmin} = require('../middlewares/permissions');
const upload = require('../middlewares/upload');

router.get('/', list)
router.get('/:id', read)

router.use(isFirmOrSuperAdmin)
router.post('/', upload.single('image'), create)
router.route('/:id')
    .put(upload.single('image'), update)
    .patch(upload.single('image'), update)
    .delete(deletee)

module.exports = router;