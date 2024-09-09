import Validator from './validator.js'
import { client } from './model.js'
import Joi from 'joi'

export default class CLientValidator extends Validator {
    getClient = Joi.object({
        clientId: Joi.string().objectId().required()
    })

    createClient = Joi.object({
        fields: client.required()
    })

    updateClient = client

    updateClientId = Joi.object({
        clientId: Joi.string().objectId().required()
    })

    removeClient = Joi.object({
        clientId: Joi.string().objectId().required()
    })
}