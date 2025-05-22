"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */

const {list, create, read, update, deletee} = require('../controllers/type');


const {isAdmin} = require('../middlewares/permissions');

router.get('/', list)

router.use(isAdmin)
router.post('/', create)
router.route('/:id')
    .get(read)
    .put(update)
    .patch(update)
    .delete(deletee)

module.exports = router;