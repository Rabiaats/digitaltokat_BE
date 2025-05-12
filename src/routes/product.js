"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */

const {list, create, read, update, deletee} = require('../controllers/product');

const {isFirmOrSuperAdmin} = require('../middlewares/permissions');

router.get('/', list)
router.get('/:id', read)

router.use(isFirmOrSuperAdmin)
router.post('/', create)
router.route('/:id')
    .put(update)
    .patch(update)
    .delete(deletee)

module.exports = router;