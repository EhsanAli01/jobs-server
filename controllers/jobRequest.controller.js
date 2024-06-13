const { jobRequest } = require('../models');
const joi = require('joi');

const jobRequestSchema = joi.object({
    experience: joi.string().min(1).max(30).required(),
    education: joi.string().min(1).required(),
    languages: joi.array().items(joi.string()).min(1).required(),
    skills: joi.array().items(joi.string()).min(1).max(5).required(),
    reqDescription: joi.string().min(20).max(80).required(),
    userId: joi.string().required(),
    jobId: joi.string().required()
});


const requestJob = async (req, res, next) => {
    try {

        const data = {
            ...req.body,
            userId: req.query.userId,
            jobId: req.query.jobId
        }

        const { value: validatedData, error: dataError } = jobRequestSchema.validate(data);

        if (dataError) {
            return res.status(400).json({
                message: dataError.details[0].message
            });
        }
        const result = await jobRequest.create(validatedData);

        return res.status(200).json({
            message: result,
        })

    } catch (error) {
        return res.status(500).json({
            message: "Failed to post application"
        });
    }
}

const declineRequest = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await jobRequest.destroy({
            where: {
                id: id
            }
        })


        return res.status(200).json({
            message: "Decline success"
        })

    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete application"
        });
    }
}


module.exports = {
    requestJob,
    declineRequest
}