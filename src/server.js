import Hapi from '@hapi/hapi'
import notes from './api/notes/index.js'
import NotesService from './services/inMemory/NotesService.js'
import NotesValidator from './validator/notes/index.js'

const init = async () => {
    const notesService = new NotesService()

    const server = Hapi.server({
        port: 5000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
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
