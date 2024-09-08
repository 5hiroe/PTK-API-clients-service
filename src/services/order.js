import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const orderUrl = process.env.API_ORDER_URL;

export async function getOrder(id) {
    try {
        const response = await axios.get(`${orderUrl}/orders/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Retourne les données de la commande si la requête est réussie
        return response.data;
    } catch (error) {
        throw error;
    }
}