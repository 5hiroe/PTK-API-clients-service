import ErrorModel from '../models/error.js'

export default class ErrorService {
    constructor () {
        if (ErrorService.instance instanceof ErrorService) {
            return ErrorService.instance
        }
        Object.freeze(this)
        ErrorService.instance = this
    }

    async create ({ error, stack }) {
        const errorModel = await new ErrorModel({ error, stack })
        await errorModel.save()
        return errorModel
    }

    async getAll() {
        const errors = await ErrorModel.find()
        return errors
    }
}