const ClientError = require('./ClientError.js')

class InvariantError extends ClientError {
    constructor(message) {
        super(message)
        this.name = 'InvariantError'
    }
}

module.exports = InvariantError
