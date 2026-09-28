require('dotenv').config();

const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET;
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

async function findUserById(userId) {
    const query = db.prepare('SELECT name, email FROM users WHERE id = ?');
    return query.get(userId);
}

function requireAuth(req, res, next) {
    try {
        const authHeader = req?.headers?.authorization || '';
        if (!authHeader) {
            return res.status(401).json({ status: 'error', message: 'Missing authorization header.' });
        }

        const token = authHeader.split(' ')[1];
        const verifiedToken = jwt.verify(token, JWT_SECRET);

        req.userId = verifiedToken.userId;

        next();
    } catch (error) {
        res.status(401).json({ status: 'error', message: error.message });
    }

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

        const token = jwt.sign(
            { userId: existingUser.id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            data: { token }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
    try {
        const user = await findUserById(req.userId);

        res.status(200).json({
            status: 'success',
            data: { user }
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