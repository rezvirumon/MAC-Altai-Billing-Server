const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Initialize the app
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = require('./config/db');
connectDB();

app.use(cors({
    origin: ['http://localhost:5173', 'https://networkshop.netlify.app/'],
  }));
  

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
// Customer API
app.use('/api/customers', require('./routes/customerRoutes'));


// Add this route in your express app to return the current time
app.get('/api/time', (req, res) => {
    const currentTime = new Date();
    res.json({ time: currentTime });
});

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Define the port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
