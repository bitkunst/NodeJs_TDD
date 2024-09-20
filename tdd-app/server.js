const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productsRoutes = require('./routes');

dotenv.config();
const app = express();
const PORT = 4000;
const mongoDBUrl = process.env.MONGO_DB_URL || '';

mongoose
    .connect(mongoDBUrl)
    .then(() => console.log('MongoDB Connected...'))
    .catch((error) => console.error(error));

app.use(express.json());

app.use('/api/products', productsRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Error Handling Middleware
app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message });
});

app.listen(PORT, () => {
    console.log(`App listening on port #${PORT}`);
});

// Integration Test를 위한 exports
module.exports = app;
