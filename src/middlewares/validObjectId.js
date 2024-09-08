import mongoose from 'mongoose';

export function checkValidObjectId(req, res, next) {
    const id = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "L'ID de la commande est invalide" });
    }

    next();
}
