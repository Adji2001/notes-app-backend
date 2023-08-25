class AuthenticationsHandler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
        this._authenticationsService = authenticationsService
        this._usersService = usersService
        this._tokenManager = tokenManager
        this._validator = validator

        this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this)
        this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this)
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this)
    }

    async postAuthenticationHandler(req, h) {
        this._validator.validatePostAuthenticationPayload(req.payload)

        // proses login
        const { username, password } = req.payload
        const id = await this._usersService.verifyUserCredential(username, password)

        // proses generate token
        const accessToken = this._tokenManager.generateAccessToken({ id })
        const refreshToken = this._tokenManager.generateRefreshToken({ id })

        // proses menyimpan access token ke database
        await this._authenticationsService.addRefreshToken(refreshToken)

        const response = h.response({
            status: 'success',
            message: 'Authentication berhasil ditambahkan',
            data: {
                accessToken,
                refreshToken
            }
        })
        response.code(201)
        return response
    }

    async putAuthenticationHandler(req, h) {
        this._validator.validatePutAuthenticationPayload(req.payload)

        const { refreshToken } = req.payload
        await this._authenticationsService.verifyRefreshToken(refreshToken)
        const { id } = this._tokenManager.verifyRefreshToken(refreshToken)

        const accessToken = this._tokenManager.generateAccessToken({ id })
        return {
            status: 'success',
            message: 'Access token berhasil diperbarui',
            data: {
                accessToken
            }
        }
    }

    async deleteAuthenticationHandler(req, h) {
        this._validator.validateDeleteAuthenticationPayload(req.payload)

        const { refreshToken } = req.payload
        await this._authenticationsService.verifyRefreshToken(refreshToken)
        await this._authenticationsService.deleteRefreshToken(refreshToken)

        return {
            status: 'success',
            message: 'Refresh token berhasil dihapus'
        }
    }
}

module.exports = AuthenticationsHandler
