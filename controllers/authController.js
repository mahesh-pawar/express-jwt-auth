const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

const authController = {

    // app.post('/api/auth/register'
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // check if user already exists with same email
            const existingUser = await userModel.findUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({ status: 'error', message: 'An account with this email already exists' });
            }

            const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
            const user = await userModel.createUser(name, email, hashPassword);

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
    },

    // app.post('/api/auth/login', 
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const existingUser = await userModel.findUserByEmail(email);
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
    },

    // app.get('/api/auth/me', requireAuth, 
    me: async (req, res) => {
        try {
            const user = await userModel.findUserById(req.userId);

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
    }
};

module.exports = authController;