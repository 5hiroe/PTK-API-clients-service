import joi from 'joi'
import joiPhoneNumber from 'joi-phone-number'

export const client = Joi.object({
    firstname: Joi.string().max(100).required(),
    lastname: Joi.string().max(100).required(),
    phone: Joi.string().phoneNumber({ defaultCountry: 'FR', format: 'international'}).required(),
    email: Joi.string().lowercase().max(100).required(),
    address: Joi.object({
        street: Joi.string().max(100).required(),
        city: Joi.string().max(100).required(),
        postalCode: Joi.string().max(10).required(),
        country: Joi.string().max(100).required()
    }).required(),
    orders: Joi.array().items(Joi.string().objectId())
})