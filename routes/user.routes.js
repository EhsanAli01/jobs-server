const express = require('express');
const router = express.Router();
const { updateUser, getUser } = require('../controllers/user.controller.js');
const { uploadSingle } = require('../fileHandler.js');


router.get('/:id', getUser);
router.patch('/update', uploadSingle, updateUser);


module.exports = router;