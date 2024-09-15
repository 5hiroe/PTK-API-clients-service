import ClientModel from '../models/client.js'
import { NotFound } from '../globals/errors.js'

export default class ClientService {
    constructor () {
        if (ClientService.instance instanceof ClientService) {
            return ClientService.instance
        }
        Object.freeze(this)
        ClientService.instance = this
    }

    /**
     * Get all clients from db.
     */
    async getAll () {
        const clients = await ClientModel.find()
        return clients
    }

    /**
     * Get a client by his id
     * 
     * @param {ObjectId} clientId
     */
    async get ({ clientId }) {
        const client = await ClientModel.findById(clientId)
        return client
    }

    /**
     * Create a custommer
     * 
     * @param {Object} fields
     */
    async create ({ fields }) {
        const client = new ClientModel(fields)
        await client.save()
        return client
    }

    /**
     * Update a client
     * 
     * @param {ObjectId} clientId
     * @param {Object} fields
     */
    async update ({ clientId, fields }) {
        const client = await ClientModel.findByIdAndUpdate(clientId, fields, { new: true })
        if (!client) {
            throw new NotFound('Client introuvable.')
        }
        return client
    }

    /**
     * Delete a client
     * 
     * @param {ObjectId} clientId
     */
    async remove ({ clientId }) {
        const client = await ClientModel.findByIdAndDelete(clientId)
        if (!client) {
            throw new NotFound('Client introuvable.')
        }
    }
}