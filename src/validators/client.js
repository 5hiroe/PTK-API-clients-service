import Validator from './validator.js'
import { client } from './model.js'
import Joi from 'joi'

export default class CLientValidator extends Validator {
    getClient = Joi.object({
        clientId: Joi.string().max(100).required()
    })

    createClient = Joi.object({
        fields: client.required()
    })

    updateClient = Joi.object({
        fields: client.required()
    })

    updateClientId = Joi.object({
        clientId: Joi.string().max(100).required()
    })

    removeClient = Joi.object({
        clientId: Joi.string().max(100).required()
    })
}
