import express from 'express'
import configure from './configurations/configuration.js'
import logger from './middlewares/logger.js'
import router from './routes/customer.js'

async function main () {
    const app = express();

    configure();

    app.use(logger);

    app.use(express.json());

    app.use('/customers', router);

    await configure(app)
    app.listen(process.env.PORT, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log(`Serveur Initialisé sur le port ${process.env.PORT}`)
        }
    })
}

main()