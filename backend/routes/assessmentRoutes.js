const express = require('express');
const multer = require('multer');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { verifyToken } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, require('os').tmpdir()); // Use OS temp directory (Vercel compatible)
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Parse JD and Create Assessment Route (Protected)
router.post('/generate', verifyToken, upload.single('jdFile'), assessmentController.createAssessmentFromJd);

// Get all Assessments (Protected - returns only user's assessments)
router.get('/', verifyToken, assessmentController.getAllAssessments);

// Get specific Assessment Route
router.get('/:id', assessmentController.getAssessment);

// Submit Assessment Route
router.post('/:id/submit', assessmentController.evaluateCandidateSubmission);

// Get Leaderboard Route
router.get('/:id/leaderboard', assessmentController.getLeaderboard);

module.exports = router;
