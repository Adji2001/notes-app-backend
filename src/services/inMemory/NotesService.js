const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError.js')
const NotFoundError = require('../../exceptions/NotFoundError.js')

class NotesService {
    constructor() {
        this._notes = []
    }

    addNote({ title, body, tags }) {
        const id = nanoid(16)
        const createdAt = new Date().toISOString()
        const updatedAt = createdAt

        const newNotes = {
            id, title, tags, createdAt, updatedAt, body
        }

        this._notes.push(newNotes)

        const isSuccess = this._notes.filter((note) => note.id === id).length > 0

        if (!isSuccess) {
            throw new InvariantError('Catatan gagal ditambahkan')
        }

        return id
    }

    getNotes() {
        return this._notes
    }

    getNoteById(id) {
        const note = this._notes.find((note) => note.id === id)

        if (!note) {
            throw new NotFoundError('Catatan tidak ditemukan')
        }

        return note
    }

    editNoteById(id, { title, body, tags }) {
        const updatedAt = new Date().toISOString()

        const index = this._notes.findIndex((note) => note.id === id)

        if (index === -1) {
            throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan')
        }

        this._notes[index] = {
            ...this._notes[index],
            title,
            tags,
            body,
            updatedAt
        }
    }

    deleteNoteById(id) {
        const index = this._notes.findIndex((note) => note.id === id)

        if (index === -1) {
            throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan')
        }

        this._notes.splice(index, 1)
    }
}

module.exports = NotesService
