const { jobs, user, jobRequest } = require("../models");
const dayjs = require("dayjs");
const { newNotification } = require("../util/notificationsHandler.js");

const checkExpiredJobs = async (req, res, next) => {
  try {
    const result = await jobs.findAll({
      where: {
        expired: false,
      },
      include: [
        {
          model: user,
          as: "user",
        },
        {
          model: jobRequest,
          as: "jobRequest",
          where: {
            status: "Applied",
          },
          include: {
            model: user,
            as: "user",
          },
        },
      ],
    });

    const today = dayjs().startOf("day");

    const jobsToExpire = result.filter((job) => {
      const expiryDate = dayjs(job.date).startOf("day");
      return expiryDate.isBefore(today);
    });

    for (const job of jobsToExpire) {
      await jobs.update(
        {
          expired: true,
        },
        {
          where: { id: job.id },
        }
      );

      newNotification(null, "Your job has been expired", job.id, job.user.id);
    }

    next();
  } catch (error) {
    console.log("unable to check expired jobs", error);
  }
};

module.exports = {
  checkExpiredJobs,
};
