require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

// notes
const notes = require('./api/notes/index.js')
const NotesService = require('./services/postgres/NotesService')
const NotesValidator = require('./validator/notes/index.js')
const ClientError = require('./exceptions/ClientError.js')

// users
const users = require('./api/users/index.js')
const UsersService = require('./services/postgres/UsersService.js')
const UsersValidator = require('./validator/users/index.js')

// authentications
const authentications = require('./api/authentications/index.js')
const AuthenticationsService = require('./services/postgres/AuthenticationsService.js')
const AuthenticationsValidator = require('./validator/authentications/index.js')
const TokenManager = require('./tokenize/TokenManager.js')

const init = async () => {
    const notesService = new NotesService()
    const usersService = new UsersService()
    const authenticationsService = new AuthenticationsService()

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    // registrasi plugin eksternal
    await server.register([
        {
            plugin: Jwt
        }
    ])

    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('notesapp_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id
            }
        })
    })

    await server.register([
        {
            plugin: notes,
            options: {
                service: notesService,
                validator: NotesValidator
            }
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator
            }
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator
            }
        }
    ])

    server.ext('onPreResponse', (request, h) => {
        // mendapatkan konteks response dari request
        const { response } = request
        if (response instanceof Error) {
            // penanganan client error secara internal.
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message
                })
                newResponse.code(response.statusCode)
                return newResponse
            }
            // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
            if (!response.isServer) {
                return h.continue
            }
            // penanganan server error sesuai kebutuhan
            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami'
            })
            newResponse.code(500)
            return newResponse
        }
        // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return h.continue
    })

    await server.start()
    console.log(`server running on ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

init()
