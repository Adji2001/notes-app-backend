const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const bcrypt = require('bcrypt')
const NotFoundError = require('../../exceptions/NotFoundError')

class UsersService {
    constructor() {
        this._pool = new Pool()
    }

    async addUser({ username, password, fullname }) {
        await this.verifyNewUsername(username)

        const id = `user-${nanoid(16)}`
        const hashedPassword = await bcrypt.hash(password, 10)

        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname]
        }

        const { rows } = await this._pool.query(query)

        if (!rows[0].id) {
            throw new InvariantError('User gagal ditambahkan')
        }

        return rows[0].id
    }

    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username]
        }

        const { rowCount } = await this._pool.query(query)

        if (rowCount) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.')
        }
    }

    async getUserById(userId) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [userId]
        }

        const { rows, rowCount } = await this._pool.query(query)

        if (!rowCount) {
            throw new NotFoundError('User tidak ditemukan')
        }

        return rows[0]
    }
}

module.exports = UsersService
