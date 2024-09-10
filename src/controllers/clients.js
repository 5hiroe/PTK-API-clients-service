import ClientService from '../services/clients.js'
import ClientValidator from '../validators/client.js'
const ClientServiceInstance = new ClientService()
const ClientValidatorInstance = new ClientValidator()

export async function getAllClients (req, res) {
    const clients = await ClientServiceInstance.getAll()
    return res.status(200).json({ clients })
}

export async function getClient (req, res) {
    const { params } = req
    ClientValidatorInstance.validate(params, ClientValidatorInstance.getClient)
    const { clientId } = req.params
    const client = await ClientServiceInstance.get({ clientId })
    return res.status(200).json({ client })
}

export async function createClient (req, res) {
    const { body } = req
    ClientValidatorInstance.validate(body, ClientValidatorInstance.createClient)
    const { fields } = req.body
    const client = await ClientServiceInstance.create({ fields })
    return res.status(200).json({ client })
}

export async function updateClient (req, res) {
    const { body, params } = req
    ClientValidatorInstance.validate(body, ClientValidatorInstance.updateClient)
    ClientValidatorInstance.validate(params, ClientValidatorInstance.updateClientId)
    const { clientId } = req.params
    const { fields } = req.body
    const client = await ClientServiceInstance.update({ clientId, fields })
    return res.status(200).json({ client })
}

export async function removeClient (req, res) {
    const { params } = req
    ClientValidatorInstance.validate(params, ClientValidatorInstance.removeClient)
    const { clientId } = req.params
    await ClientServiceInstance.remove({ clientId })
    return res.status(200).json({ message: 'Client supprimé.' })
}