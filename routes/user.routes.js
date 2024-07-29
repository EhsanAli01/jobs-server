const express = require("express");
const router = express.Router();
const {
  updateUser,
  getUser,
  deleteUser,
} = require("../controllers/user.controller.js");
const { uploadSingle } = require("../fileHandler.js");

router.get("/:id", getUser);
router.patch("/update", uploadSingle, updateUser);
router.delete("/delete", uploadSingle, deleteUser);

module.exports = router;
