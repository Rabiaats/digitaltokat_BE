"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */

const {list, create, read, update, deletee} = require('../controllers/type');


const {isSuperAdmin} = require('../middlewares/permissions');

router.get('/', list)

router.use(isSuperAdmin)
router.post('/', create)
router.route('/:id')
    .get(read)
    .put(update)
    .patch(update)
    .delete(deletee)

module.exports = router;