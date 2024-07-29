const { jobs, jobRequest, user, reviews } = require("../models");
const joi = require("joi");

const jobSchema = joi.object({
  jobTitle: joi.string().min(3).max(30).required(),
  category: joi.string().required(),
  subCategory: joi.string().required(),
  description: joi.string().min(10).max(80).required(),
  location: joi.string().required(),
  date: joi.date().required(),
  startTime: joi.string().required(),
  endTime: joi.string().required(),
  images: joi.array().items(joi.string()).min(1).max(3).required(),
  userId: joi.string().required(),
});

const getJob = async (req, res, next) => {
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
          include: {
            model: user,
            as: "user",
          },
        },
      ],
    });

    res.status(200).json({
      message: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get data",
    });
  }
};

const getJobById = async (req, res, next) => {
  try {
    const result = await jobs.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: user,
          as: "user",
        },
        {
          model: jobRequest,
          as: "jobRequest",
          include: {
            model: user,
            as: "user",
          },
        },
        {
          model: reviews,
          as: "reviews",
        },
      ],
    });

    res.status(200).json({
      message: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get data",
    });
  }
};

const conGetJobByStatus = async (req, res, next) => {
  try {
    const { status, userId } = req.query;
    if (!status || !userId) {
      return res.status(400).json({
        message: "Missing status or userId in query parameters",
      });
    }

    const result = await jobs.findAll({
      where: {
        expired: false,
      },
      include: [
        {
          model: jobRequest,
          where: { status: status },
          as: "jobRequest",
          required: true,
          include: {
            model: user,
            as: "user",
            where: { id: userId },
            required: true,
          },
        },
        {
          model: reviews,
          as: "reviews",
          include: [
            {
              model: user,
              as: "user",
            },
            {
              model: jobs,
              as: "jobs",
              include: {
                model: jobRequest,
                as: "jobRequest",
              },
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get data",
    });
  }
};

const getJobByStatus = async (req, res, next) => {
  try {
    const { status, userId } = req.query;

    if (!status || !userId) {
      return res.status(400).json({
        message: "Missing status or userId in query parameters",
      });
    }

    const result = await user.findOne({
      where: { id: userId },
      include: {
        model: jobs,
        as: "jobs",
        include: [
          {
            model: jobRequest,
            as: "jobRequest",
            where: { status: status },
            required: true,
          },
          {
            model: reviews,
            as: "reviews",
            include: [
              {
                model: user,
                as: "user",
              },
              {
                model: jobs,
                as: "jobs",
                include: {
                  model: jobRequest,
                  as: "jobRequest",
                },
              },
            ],
          },
        ],
      },
    });

    res.status(200).json({
      message: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get data",
      error: error,
    });
  }
};
const getJobByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const result = await user.findOne({
      where: { id: userId },
      include: {
        model: jobs,
        as: "jobs",
        required: true,
        include: {
          model: jobRequest,
          as: "jobRequest",
        },
      },
    });

    res.status(200).json({
      message: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get data",
    });
  }
};

const createJob = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(userId);

    const img = req.files;
    const images = img.map((file) => `uploads/${file.filename}`);

    const jobData = {
      ...req.body,
      images,
      userId,
    };

    const { value: validatedData, error: dataError } =
      jobSchema.validate(jobData);

    if (dataError) {
      return res.status(400).json({
        message: dataError.details[0].message,
      });
    }

    const result = await jobs.create(validatedData);

    return res.status(201).json({
      message: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to post job",
    });
  }
};

const createReview = async (req, res, next) => {
  try {
    const { userId, jobId } = req.query;
    const { starCount, message } = req.body;

    const result = await reviews.create({
      userId,
      jobId,
      starCount,
      message,
    });

    res.status(200).json({
      message: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to post review",
    });
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await jobs.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "Job deleted successfully",
      result: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

module.exports = {
  createJob,
  getJob,
  getJobById,
  getJobByStatus,
  getJobByUser,
  conGetJobByStatus,
  createReview,
  deleteJob,
};
