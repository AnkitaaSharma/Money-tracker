// Import necessary modules at the top
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Transaction = require('./models/Transaction');
const dotenv = require("dotenv");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;


const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
// Connect to MongoDB
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.m6pae.mongodb.net/Moneytracker`);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API to fetch transactions
app.get('/transactions', async (req, res) => {
    const transactions = await Transaction.find({});
    res.json(transactions);
});

// Route to add a new transaction
app.post('/add-transaction', async (req, res) => {
    const { type, amount, info, date } = req.body;
    const transaction = new Transaction({ type, amount, info, date });
    await transaction.save();
    res.redirect('/');
});

// Route to delete a transaction
app.post('/delete-transaction', async (req, res) => {
    const { id } = req.body;
    await Transaction.findByIdAndDelete(id);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});