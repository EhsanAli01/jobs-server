const express = require('express');
const router = express.Router();
const { register, login, checkEmail, checkOtp, passwordReset } = require('../controllers/auth.controller.js');

router.post('/signup', register);
router.post('/login', login);
router.post('/password-reset/find-email', checkEmail);
router.post('/password-reset/otp-verification', checkOtp);
router.patch('/password-reset/update-password', passwordReset);


module.exports = router;