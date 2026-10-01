require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const app = express();

const authRoute = require('./routes/authRoutes');

app.use(helmet());
app.use(express.json());
app.use('/api/auth', authRoute);

app.get('/status', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is running' });
})

// Unmatched routes
app.use((req, res) => {
    res.status(404).json({ status: 'error', code: 'NOT_FOUND', message: 'Route not found' });
});

// Must be last
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`);
})