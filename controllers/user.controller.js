const joi = require('joi');
const { user, jobRequest, jobs } = require('../models');
const jwt = require('jsonwebtoken');

const updateProfileSchema = joi.object({
    image: joi.string().allow(null).allow('').optional(),
    experience: joi.string().max(30).allow(null).allow('').optional(),
    education: joi.string().allow(null).allow('').optional(),
    languages: joi.array().items(joi.string().allow(null).allow('')).allow(null).optional(),
    skills: joi.array().items(joi.string().allow(null).allow('')).max(5).allow(null).optional(),
    description: joi.string().max(80).allow(null).allow('').optional()
});


const getUser = async (req, res, next) => {
    try {
        const result = await user.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: jobRequest,
                as: 'jobRequests'
            },
            {
                model: jobs,
                as: 'jobs',
                include: {
                    model: jobRequest,
                    as: 'jobRequest'
                }
            }
            ]
        })

        return res.status(200).json({
            message: result
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}


const updateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(500).json({
                message: 'Token not found'
            })
        }
        console.log(req.body.languages);
        const userData = jwt.decode(token);

        const img = req.file?.filename;
        const image = `uploads/${img}`;

        const updateData = {
            ...req.body,
            image: image
        };

        const { value: validatedData, error: dataError } = updateProfileSchema.validate(img ? updateData : req.body);

        if (dataError) {
            return res.status(400).json({
                message: dataError.details[0].message
            });
        }

        const result = await user.update(
            validatedData,
            { where: { id: userData.id } }
        );

        return res.status(200).json({
            message: result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Couldn't update profile."
        });
    }
};

module.exports = {
    updateUser,
    getUser
};
