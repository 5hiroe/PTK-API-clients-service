import Joi from 'joi'
import JoiPhoneNumber from 'joi-phone-number'

export const client = Joi.object({
    firstname: Joi.string().max(100).required(),
    lastname: Joi.string().max(100).required(),
    phone: Joi.string().max(10).required(),
    email: Joi.string().lowercase().max(100).required(),
    address: Joi.object({
        street: Joi.string().max(100).required(),
        city: Joi.string().max(100).required(),
        postalCode: Joi.string().max(10).required(),
        country: Joi.string().max(100).required()
    }).required(),
    orders: Joi.array().items(Joi.string().max(100)).required()
})