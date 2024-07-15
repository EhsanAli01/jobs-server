const express = require("express");
const router = express.Router();
const {
  updateUser,
  getUser,
  updateRating,
} = require("../controllers/user.controller.js");
const { uploadSingle } = require("../fileHandler.js");

router.get("/:id", getUser);
router.patch("/update", uploadSingle, updateUser);
router.patch("/rate/:id", updateRating);

module.exports = router;
