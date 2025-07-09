const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth'); // <-- your signup/login logic

// ✅ Load env variables
dotenv.config();

// ✅ Initialize app
const app = express();

// ✅ Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));
app.use(express.json());

// ✅ Routes
app.use('/api', authRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Start server
app.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
});
