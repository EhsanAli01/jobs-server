const { jobRequest } = require("../models");
const joi = require("joi");

const jobRequestSchema = joi.object({
  expectedSalary: joi.number().min(1).required(),
  type: joi.string().required(),
  note: joi.string().min(15).max(80).required(),
  jobId: joi.string().required(),
  userId: joi.string().required(),
});

const requestJob = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      userId: req.query.userId,
      jobId: req.query.jobId,
    };

    const { value: validatedData, error: dataError } =
      jobRequestSchema.validate(data);

    if (dataError) {
      return res.status(400).json({
        message: dataError.details[0].message,
      });
    }
    const result = await jobRequest.create({
      ...validatedData,
      status: "Applied",
    });

    return res.status(200).json({
      message: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to post application",
    });
  }
};

const declineRequest = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await jobRequest.destroy({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "Decline success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete application",
    });
  }
};

const acceptRequest = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await jobRequest.update(
      { status: "Accepted" },
      { where: { id: id } }
    );

    return res.status(200).json({
      message: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to accept application",
    });
  }
};

module.exports = {
  requestJob,
  declineRequest,
  acceptRequest,
};
