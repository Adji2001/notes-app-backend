import { nanoid } from 'nanoid'
import notes from './notes.js'

const addNoteHandler = (req, h) => {
    const { title, tags, body } = req.payload

    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const newNotes = {
        id, title, tags, createdAt, updatedAt, body
    }

    notes.push(newNotes)

    const isSuccess = notes.filter((note) => note.id === id).length > 0

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id
            }
        })
        response.code(201)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan'
    })
    response.code(500)
    return response
}

const getAllNotes = (req, h) => {
    if (notes.length > 0) {
        return {
            status: 'success',
            data: {
                notes
            }
        }
    }

    return {
        status: 'success',
        data: {
            notes: []
        }
    }
}

const getNoteById = (req, h) => {
    const { id } = req.params

    const finded = notes.find((note) => note.id === id)

    if (finded !== undefined) {
        return {
            status: 'success',
            data: {
                note: finded
            }
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan'
    })
    response.code(404)
    return response
}

const updateNoteById = (req, h) => {
    const { id } = req.params
    const { title, tags, body } = req.payload
    const updatedAt = new Date().toISOString()

    const index = notes.findIndex((note) => note.id === id)

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt
        }

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diubah'
        })
        response.code(200)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal diubah. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

const deleteNoteById = (req, h) => {
    const { id } = req.params

    const index = notes.findIndex((note) => note.id === id)

    if (index !== -1) {
        notes.splice(index, 1)

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus'
        })
        response.code(200)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

export { addNoteHandler, getAllNotes, getNoteById, updateNoteById, deleteNoteById }
