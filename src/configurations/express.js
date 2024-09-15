import express from 'express'
import 'express-async-errors'
import errorHandler from '../helpers/error_handler.js'
import clientRoutes from '../routes/client.js'

/**
 * Express configuration
 */

export async function configure (app) {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/', clientRoutes)
    app.use(errorHandler)
    console.log('Express configured.')
}