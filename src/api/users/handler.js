class UsersHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator

        this.postUserHandler = this.postUserHandler.bind(this)
        this.getUserByIdHandler = this.getUserByIdHandler.bind(this)
    }

    async postUserHandler(req, h) {
        this._validator.validateUserPayload(req.payload)

        const userId = await this._service.addUser(req.payload)

        const response = h.response({
            status: 'success',
            message: 'User berhasil ditambahkan',
            data: {
                userId
            }
        })
        response.code(201)
        return response
    }

    async getUserByIdHandler(req, h) {
        const { id } = req.params

        const user = await this._service.getUserById(id)

        return {
            status: 'success',
            data: {
                user
            }
        }
    }
}

module.exports = UsersHandler
