require('dotenv').config();
const express = require('express');
const cors = require('cors');

const assessmentRoutes = require('./routes/assessmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*', // Allow all for development and production debugging
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint so the user doesn't see "Cannot GET /"
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'JDEX API is running! Vercel and Local should both see this.' });
});

// Health check endpoint mapping
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running smoothly!' });
});

app.use('/api/assessments', assessmentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
