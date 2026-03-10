const fs = require('fs');
const pdfParse = require('pdf-parse');
const { collection, addDoc, getDoc, doc, getDocs, query, where, orderBy } = require('firebase/firestore');
const { db } = require('../config/firebase');
const geminiService = require('../services/geminiService');

/**
 * Handle job description upload, parse text via Gemini,
 * and create a tailored assessment in Firestore.
 */
async function createAssessmentFromJd(req, res) {
    try {
        let jdText = '';

        if (req.file) {
            // Read PDF and extract text
            const dataBuffer = fs.readFileSync(req.file.path);
            const data = await pdfParse(dataBuffer);
            jdText = data.text;
            
            // Clean up the temp file
            fs.unlinkSync(req.file.path);
        } else if (req.body.text) {
            jdText = req.body.text;
        } else {
            return res.status(400).json({ error: 'Please provide either a file or text content.' });
        }

        if (jdText.trim() === '') {
            return res.status(400).json({ error: 'Extracted text is empty.' });
        }

        const assessmentType = req.body.type || 'mcq';

        console.log('Parsing JD using Gemini...');
        const parsedJd = await geminiService.parseJobDescription(jdText);

        console.log(`Generating ${assessmentType} Assessment using Gemini...`);
        const assessment = await geminiService.generateAssessment(parsedJd, assessmentType);

        console.log('Saving Assessment to Firebase...');
        const docRef = await addDoc(collection(db, 'assessments'), {
            parsedJd,
            assessment,
            originalText: jdText,
            createdAt: new Date().toISOString(),
            createdBy: req.user?.uid || 'anonymous'
        });

        res.status(201).json({
            message: 'Assessment created successfully',
            assessmentId: docRef.id,
            data: assessment
        });

    } catch (error) {
        console.error('Controller Error:', error);
        res.status(500).json({
            error: 'Failed to process Job Description.',
            details: error?.message || String(error)
        });
    }
}

/**
 * Fetch a specific assessment by its ID
 */
async function getAssessment(req, res) {
    try {
        const docRef = doc(db, 'assessments', req.params.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res.status(404).json({ error: 'Assessment not found.' });
        }

        res.json({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve Assessment.' });
    }
}

/**
 * Evaluate a candidate's submission
 */
async function evaluateCandidateSubmission(req, res) {
    try {
        const assessmentId = req.params.id;
        const candidateData = req.body; 
        // candidateData structure: 
        // { candidateName, email, candidateAnswers: { mcqs: [...], subjective: [...] } }

        console.log('Fetching assessment config...');
        const docRef = doc(db, 'assessments', assessmentId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res.status(404).json({ error: 'Assessment not found.' });
        }

        const assessmentConfig = docSnap.data().assessment;

        console.log('Evaluating candidate with Gemini...');
        const evaluationResult = await geminiService.evaluateCandidate(candidateData.candidateAnswers, assessmentConfig);

        console.log('Saving scorecard to Firebase candidates collection...');
        const candidateRef = await addDoc(collection(db, 'candidates'), {
            assessmentId,
            candidateName: candidateData.candidateName,
            email: candidateData.email,
            answers: candidateData.candidateAnswers,
            evaluation: evaluationResult,
            submittedAt: new Date().toISOString()
        });

        res.status(200).json({
            message: 'Evaluation complete',
            candidateId: candidateRef.id,
            evaluation: evaluationResult
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to evaluate submission.' });
    }
}

/**
 * Get the leaderboard for a specific assessment
 */
async function getLeaderboard(req, res) {
    try {
        const assessmentId = req.params.id;
        
        const candidatesRef = collection(db, 'candidates');
        const q = query(candidatesRef, where('assessmentId', '==', assessmentId));
        const querySnapshot = await getDocs(q);
        
        const leaderboard = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            leaderboard.push({
                id: doc.id,
                candidateName: data.candidateName,
                evaluation: data.evaluation,
                totalScore: (data.evaluation?.mcqScore || 0) + (data.evaluation?.subjectiveScore || 0),
                submittedAt: data.submittedAt
            });
        });

        // Simple sorting locally logic (descending by total score)
        leaderboard.sort((a, b) => b.totalScore - a.totalScore);

        res.json({ title: 'Leaderboard', leaderboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch leaderboard.' });
    }
}

/**
 * Fetch all assessments
 */
async function getAllAssessments(req, res) {
    try {
        const assessmentsRef = collection(db, 'assessments');
        const q = query(assessmentsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const assessments = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            assessments.push({
                id: doc.id,
                title: data.parsedJd?.role || 'Untitled Assessment',
                role: data.parsedJd?.role || 'N/A',
                createdAt: data.createdAt
            });
        });

        res.json(assessments);
    } catch (error) {
        console.error('Error fetching all assessments:', error);
        res.status(500).json({ error: 'Failed to fetch assessments.' });
    }
}

module.exports = {
    createAssessmentFromJd,
    getAssessment,
    getAllAssessments,
    evaluateCandidateSubmission,
    getLeaderboard
};
