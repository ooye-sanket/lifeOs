require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/checkins', require('./routes/checkins'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Life OS API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});