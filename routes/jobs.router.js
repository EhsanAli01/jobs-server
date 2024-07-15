const express = require("express");
const router = express.Router();
const {
  createJob,
  getJob,
  getJobById,
  getJobByStatus,
  getJobByUser,
  conGetJobByStatus,
} = require("../controllers/jobs.controller");

const {
  requestJob,
  declineRequest,
  acceptRequest,
  completedRequest,
} = require("../controllers/jobRequest.controller.js");

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  markSeen,
} = require("../controllers/notification.controller.js");

const { uploadMulti } = require("../fileHandler.js");

// User routes
router.get("/user", getJob);
router.get("/user/get-by-id/:id", getJobById);
router.get("/user/get-by-user/:userId", getJobByUser);
router.get("/user/get-by-status/", getJobByStatus);
router.post("/user/create/:id", uploadMulti, createJob);
router.delete("/user/decline", declineRequest);
router.patch("/user/accept", acceptRequest);
router.patch("/user/complete/:id", completedRequest);
router.get("/user/notifications/:id", getNotifications);
router.patch("/user/notifications/mark-seen", markSeen);
router.patch("/user/notifications/mark-as-read/:id", markAsRead);
router.patch("/user/notifications/mark-all-as-read/:id", markAllAsRead);
router.delete("/user/notifications/delete/:id", deleteNotification);

// Contractor routes
router.get("/contractor", getJob);
router.get("/contractor/get-by-id/:id", getJobById);
router.get("/contractor/con-get-by-status/", conGetJobByStatus);
router.post("/contractor/request", requestJob);
router.get("/contractor/notifications/:id", getNotifications);
router.patch("/contractor/notifications/mark-seen", markSeen);
router.patch("/contractor/notifications/mark-as-read/:id", markAsRead);
router.patch("/contractor/notifications/mark-all-as-read/:id", markAllAsRead);
router.delete("/contractor/notifications/delete/:id", deleteNotification);

module.exports = router;
