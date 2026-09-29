const db = require('../db');

const userModel = {
    async findUserByEmail(email) {
        const query = db.prepare('SELECT id, name, email, password FROM users WHERE email = ?');
        return query.get(email);
    },

    async createUser(name, email, password) {
        const query = db.prepare('INSERT into users (name, email, password) VALUES (?, ?, ?)');
        const user = query.run(name, email, password);

        const getUserQuery = db.prepare('SELECT id, name, email FROM users WHERE id = ?');
        return getUserQuery.get(user.lastInsertRowid);
    },

    async findUserById(userId) {
        const query = db.prepare('SELECT id, name, email FROM users WHERE id = ?');
        return query.get(userId);
    }
};

module.exports = userModel;