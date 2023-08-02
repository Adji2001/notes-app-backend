const Hapi = require('@hapi/hapi')
const notes = require('./api/notes/index.js')
const NotesService = require('./services/postgres/NotesService')
const NotesValidator = require('./validator/notes/index.js')
require('dotenv').config()

const init = async () => {
    const notesService = new NotesService()

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    await server.register({
        plugin: notes,
        options: {
            service: notesService,
            validator: NotesValidator
        }
    })

    await server.start()
    console.log(`server running on ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

init()
