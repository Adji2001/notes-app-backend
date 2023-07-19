import Hapi from '@hapi/hapi'
import routes from './routes.js'

const init = async () => {
    const server = Hapi.server({
        port: 8000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    server.route(routes)

    await server.start()
    console.log(`server running on ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

init()
