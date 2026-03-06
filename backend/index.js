require('dotenv').config();
const express = require('express');
const cors = require('cors');

const assessmentRoutes = require('./routes/assessmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/assessments', assessmentRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running smoothly!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
