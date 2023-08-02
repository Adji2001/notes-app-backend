const InvariantError = require('../../exceptions/InvariantError.js')
const { NotePayloadSchema } = require('./schema.js')

const NotesValidator = {
    validateNotePayload: (payload) => {
        const validationResult = NotePayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = NotesValidator
