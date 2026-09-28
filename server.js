require('dotenv').config();

const express = require('express');
const app = express();

const bcrypt = require('bcryptjs');

const db = require('./db');

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

app.use(express.json());

async function findUserByEmail(email) {
    const query = db.prepare('SELECT id, name, email, password FROM users WHERE email = ?');
    return query.get(email);
}

async function createUser(name, email, password) {
    const query = db.prepare('INSERT into users (name, email, password) VALUES (?, ?, ?)');
    const user = query.run(name, email, password);

    const getUserQuery = db.prepare('SELECT id, name, email FROM users WHERE id = ?');
    return getUserQuery.get(user.lastInsertRowid);
}

app.get('/status', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is running' });
})

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if user already exists with same email
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ status: 'error', message: 'An account with this email already exists' });
        }

        const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await createUser(name, email, hashPassword);

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: user
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (!existingUser) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        const passwordMatched = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatched) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully'
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`);
})