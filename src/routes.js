import { addNoteHandler, deleteNoteById, getAllNotes, getNoteById, updateNoteById } from './handler.js'

const routes = [
    {
        method: 'POST',
        path: '/notes',
        handler: addNoteHandler
    },
    {
        method: 'GET',
        path: '/notes',
        handler: getAllNotes
    },
    {
        method: 'GET',
        path: '/notes/{id}',
        handler: getNoteById
    },
    {
        method: 'PUT',
        path: '/notes/{id}',
        handler: updateNoteById
    },
    {
        method: 'DELETE',
        path: '/notes/{id}',
        handler: deleteNoteById
    }
]

export default routes
