import express from 'express';
import logger from '../middlewares/logger.js';
import Customer from '../models/customer.js';
import { ordersExist } from '../middlewares/orderExist.js';
import { checkValidObjectId } from '../middlewares/validObjectId.js';
import { validateEmail } from '../middlewares/validEmail.js';

const router = express.Router();

router.use(logger);

router.get('/', async (req, res) => {
    try {
      const customers = await Customer.find();  // Récupère tous les clients
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error });
    }
  });

router.get('/:id', checkValidObjectId, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);  // Récupère le client par son id
        if (!customer) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.post('/', ordersExist, validateEmail, async (req, res) => {
    const { firstname, lastname, phone, email, address, orders } = req.body; // Récupérer les données du corps
    if (!firstname || !lastname || !phone || !email) {
        return res.status(400).json({ error: 'Le nom, le prénom, le numéro de téléphone et l\'email sont requis' });
    }

    try {
        const newCustomer = new Customer({ firstname, lastname, phone, email, address, orders }); // Créer un nouvel objet client
        await newCustomer.save();  // Sauvegarder dans MongoDB
        res.status(201).json({ message: 'Client créé', customer: newCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du client', error });
    }
});

router.put('/:id', checkValidObjectId, ordersExist, validateEmail, async (req, res) => {
    const { firstname, lastname, phone, email, address, orders } = req.body; // Récupérer les données du corps
    if (!firstname || !lastname || !phone || !email) {
        return res.status(400).json({ error: 'Le nom, le prénom, le numéro de téléphone et l\'email sont requis' });
    }

    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { firstname, lastname, phone, email, address, orders },
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        
        res.status(200).json({ message: 'Client modifié', customer: customer });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification du client', error });
    }
});

router.delete('/:id', checkValidObjectId, async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);  // Supprime le client par son id
        if (!customer) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        res.json({ message: 'Client supprimé', customer: customer });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

export default router;