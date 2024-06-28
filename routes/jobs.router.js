const express = require("express");
const router = express.Router();
const {
  createJob,
  getJob,
  getJobById,
} = require("../controllers/jobs.controller");
const { uploadMulti } = require("../fileHandler.js");
const {
  requestJob,
  declineRequest,
  acceptRequest,
} = require("../controllers/jobRequest.controller.js");

// User routes
router.get("/user", getJob);
router.get("/user/:id", getJobById);
router.post("/user/:id", uploadMulti, createJob);
router.delete("/user/delete/:id", declineRequest);
router.patch("/user/accept/:id", acceptRequest);

// Contractor routes
router.get("/contractor", getJob);
router.get("/contractor/:id", getJobById);
router.post("/contractor/request", requestJob);

module.exports = router;
