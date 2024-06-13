const { jobs, jobRequest, user } = require('../models');
const joi = require('joi');

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
    userId: joi.string().required()
});

const getJob = async (req, res, next) => {
    try {
        const result = await jobs.findAll({
            include: [
                {
                    model: user,
                    as: 'user'
                },
                {
                    model: jobRequest,
                    as: 'jobRequest'
                }
            ]
        });
        res.status(200).json({
            message: result
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get data"
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
                    as: 'user'
                },
                {
                    model: jobRequest,
                    as: 'jobRequest',
                    include: {
                        model: user,
                        as: 'user'
                    }
                }
            ]
        });
        res.status(200).json({
            message: result
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get data"
        });
    }
};


const createJob = async (req, res, next) => {
    try {
        const userId = req.params.id;
        console.log(userId);

        const img = req.files;
        const images = img.map(file => `uploads/${file.filename}`);

        const jobData = {
            ...req.body,
            images,
            userId
        }

        const { value: validatedData, error: dataError } = jobSchema.validate(jobData);

        if (dataError) {
            return res.status(400).json({
                message: dataError.details[0].message
            });
        }

        const result = await jobs.create(validatedData);

        if (result) {
            return res.status(201).json({
                message: result
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to post job"
        });
    }
};


module.exports = {
    createJob,
    getJob,
    getJobById
};
