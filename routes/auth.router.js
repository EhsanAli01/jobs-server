const express = require("express");
const router = express.Router();
const {
  register,
  login,
  checkEmail,
  checkOtp,
  passwordReset,
  sendOtp,
  verify,
} = require("../controllers/auth.controller.js");

router.post("/login", login);
router.post("/signup", register);
router.post("/signup/verify", verify);
router.post("/password-reset/find-email", checkEmail);
router.post("/password-reset/otp-verification", checkOtp);
router.patch("/password-reset/update-password", passwordReset);
router.post("/resend-otp", sendOtp);

module.exports = router;
