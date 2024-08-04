import mongoose from "mongoose"

/**
 * Mongo configuration
 */
export async function configure (app) {
    return mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('Mongo Initialized.')
        })
        .catch((error) => {
            console.log('Mongo Failed: ', error)
        })
}