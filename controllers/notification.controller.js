const { jobs, notifications, user, sequelize } = require("../models");

const getNotifications = async (req, res, next) => {
  try {
    const receiverId = req.params.id;
    const result = await notifications.findAll({
      where: { receiverId },
      include: [
        {
          model: user,
          as: "sender",
        },
        {
          model: jobs,
          as: "job",
        },
      ],
    });

    res.status(200).json({
      message: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const markSeen = async (req, res, next) => {
  const notificationsArray = req.body.notificationsArray;
  const transaction = await sequelize.transaction();

  try {
    for (const notification of notificationsArray) {
      await notifications.update(
        {
          seen: true,
        },
        {
          where: {
            id: notification.id,
          },
          transaction,
        }
      );
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error("Failed to update records:", error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const result = await notifications.update(
      { status: false },
      { where: { id: notificationId } }
    );
    res.status(200).json({
      message: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const receiverId = req.params.id;
    const result = await notifications.update(
      { status: false },
      { where: { receiverId } }
    );
    res.status(200).json({
      message: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const result = await notifications.destroy({
      where: { id: notificationId },
    });
    res.status(200).json({
      message: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  markSeen,
};
