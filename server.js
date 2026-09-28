require('dotenv').config();

const express = require('express');
const app = express();

app.get('/status', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is running' });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`);
})