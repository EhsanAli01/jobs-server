const Joi = require('joi');
const { user } = require('../models');
const jwt = require('jsonwebtoken');

const updateProfileSchema = Joi.object({
    description: Joi.string().min(15).max(80).required(),
    image: Joi.string().required()
});


const getUser = async (req, res, next) => {
    try {
        const result = await user.findOne({
            where: {
                id: req.params.id
            }
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

        const userData = jwt.decode(token);
        console.log(userData);
        const img = req.file.filename;
        const image = `uploads/${img}`;

        const updateData = {
            ...req.body,
            image: image
        };

        const { value: validatedData, error: dataError } = updateProfileSchema.validate(updateData);

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
