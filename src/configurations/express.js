import express from 'express'
import 'express-async-errors'
import errorHandler from '../helpers/error_handler.js'
import clientRoutes from '../routes/client.js'
import expressRateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors'



/**
 * Express configuration
 */

export async function configure (app) {
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(expressRateLimit({
      windowMs: 1 * 60 * 1000, // 15 minutes
      max: 100,
      message: 'You exceed 100 requests in 15 minutes',
      headers: true // limit each IP to 100 requests per windowMs
    }))
    app.use(helmet())
    app.use(helmet.hsts({
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }))
    app.use(helmet.frameguard({
      action: 'deny'
    }))
    app.use(helmet.xssFilter())
    app.use(helmet.noSniff())
    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", ''],
        fontSrc: ["'self'", ''],
        scriptSrc: ["'self'", ''],
        imgSrc: ["'self'"]
      }
    }))

    app.use('/', clientRoutes)
    app.use(errorHandler)
    console.log('Express configured.')

}