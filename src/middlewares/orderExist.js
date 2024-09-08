import { getOrder } from '../services/order.js';
import mongoose from 'mongoose';

export async function ordersExist(req, res, next) {
    const orders = req.body.orders;
    
    try {
        for (const order of orders) {
            if (!mongoose.Types.ObjectId.isValid(order)) {
                return res.status(400).json({ error: "L'ID de la commande est invalide" });
            }

            await getOrder(order);
        }
    } catch (error) {
        return res.status(404).json({ error: "La commande n'existe pas" });
    }

    next();
}