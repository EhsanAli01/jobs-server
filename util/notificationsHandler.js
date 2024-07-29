const { notifications } = require("../models");

const newNotification = async (senderId, action, jobId, receiverId) => {
  try {
    await notifications.create({
      senderId: senderId,
      receiverId: receiverId,
      jobId: jobId,
      action: action,
      read: false,
    });
  } catch (error) {
    console.log("unable to create notification", error);
  }
};

module.exports = {
  newNotification,
};
