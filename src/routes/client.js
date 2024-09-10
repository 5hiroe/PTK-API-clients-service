import express from 'express'
import * as clients from '../controllers/clients.js'

const router = express.Router()

router.get('/', clients.getAllClients)
router.get('/:clientId', clients.getClient)
router.post('/', clients.createClient)
router.put('/:clientId', clients.updateClient)
router.delete('/:clientId', clients.removeClient)

export default router