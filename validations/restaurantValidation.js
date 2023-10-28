const Joi = require('joi');

const {StatusCodes} = require('http-status-codes');

module.exports = {
    createNew: async (req, res) => {
        const correctCondition = Joi.object({
            resname: Joi.string().required().min(3).max(250).trim().strict(),
            address: Joi.object({
                street: Joi.string().required().min(3).max(250).trim().strict(),
                district: Joi.string().required().min(3).max(250).trim().strict(),
                city: Joi.string().required().min(3).max(250).trim().strict(),
              }).required(),
            timeOpen: Joi.string().required().min(3).max(250).trim().strict(),
            timeClose: Joi.string().required().min(3).max(250).trim().strict(),
            seats: Joi.number().required().min(3).max(250).trim().strict(),
            typeOfRes: Joi.string().required().min(3).max(250).trim().strict(),
            averagePrice: Joi.number().required(),
            pointEvaluation: Joi.string(),
            description: Joi.string(),
            image: Joi.string()
        })

        try {
            await correctCondition.validateAsync(req.body);
            let result = await useServices.createRestaurant(req.body);
            return res.status(StatusCodes.CREATED).json(
                {
                    EC: 0,
                    data: result
                })
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                EC: 1,
                error: error
            })
        }

    }
}