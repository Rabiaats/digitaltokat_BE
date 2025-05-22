"use strict"

const router = require('express').Router();
/* ------------------------------------------------------- */

const {list, deletee} = require('../controllers/product');
const {isAdmin} = require('../middlewares/permissions');

router.get("/", isAdmin, list);

router.delete("/", isAdmin, deletee)

module.exports = router;
