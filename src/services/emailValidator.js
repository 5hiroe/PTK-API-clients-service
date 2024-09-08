import Customer from '../models/customer.js';

export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function checkEmailUniqueness(email) {
    try {
        const user = await Customer.findOne({ email: email });
        return !user;
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'unicité de l\'email:', error);
        throw new Error('Erreur lors de la vérification de l\'email');
    }
}