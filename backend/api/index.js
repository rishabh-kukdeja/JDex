require('dotenv').config();
const express = require('express');
const cors = require('cors');

const assessmentRoutes = require('../routes/assessmentRoutes');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        process.env.FRONTEND_URL || 'https://yourdomain.vercel.app'
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running smoothly!' });
});

// API routes
app.use('/api/assessments', assessmentRoutes);

// For Vercel serverless functions
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
