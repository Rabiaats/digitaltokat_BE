"use strict"

const router = require('express').Router();


const { create, read, update, deletee } = require('../controllers/comment');
const { isLogin } = require('../middlewares/permissions');

// URL: /comments

router.use(isLogin)

router.route('/').post(create);

router.route('/:id').get(read).put(update).patch(update).delete(deletee);

/* ------------------------------------------------------- */
module.exports = router;