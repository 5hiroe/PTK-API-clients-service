import { isValidEmail, checkEmailUniqueness } from '../services/emailValidator.js';

export async function validateEmail(req, res, next) {
    const email = req.body.email;

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Adresse e-mail invalide' });
    }

    const isUnique = await checkEmailUniqueness(email);
    if (!isUnique) {
        return res.status(400).json({ error: 'Adresse e-mail déjà utilisée' });
    }

    next();
}
