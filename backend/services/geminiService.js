const { GoogleGenAI } = require('@google/genai');

let ai;
try {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key_for_build' });
} catch (error) {
    console.warn('⚠️ Google Gen AI initialization skipped. Ensure GEMINI_API_KEY is set in production environment.');
}

/**
 * Extracts key details from a Job Description.
 */
async function parseJobDescription(jdText) {
    const prompt = `You are an expert technical recruiter and AI assessment designer.
I will give you a job description. You must extract the following exact JSON structure and nothing else:
{
  "role": "string",
  "seniority": "string",
  "domain": "string",
  "keyResponsibilities": ["array of strings"],
  "coreSkillsRequired": ["array of strings"],
  "differentiatingFactors": ["what separates a great hire from a good one for this role based on JD details"]
}
Here is the job description:
${jdText}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error('Error parsing JD:', error);
        throw new Error('Failed to parse Job Description using Gemini.');
    }
}

/**
 * Generates an assessment using the parsed job description.
 */
async function generateAssessment(parsedJd, type) {
    let subPrompt = '';
    let jsonStructure = '';

    if (type === 'coding') {
        subPrompt = `Create 2 coding problems exactly tailored to the skills listed. Do not generate any MCQs.`;
        jsonStructure = `{
  "title": "\${parsedJd.role} Coding Assessment",
  "mcqs": [],
  "subjective": [],
  "coding": [
    {
      "problemStatement": "Descriptive coding challenge...",
      "examples": [{ "input": "...", "output": "..." }],
      "testCases": [{ "input": "...", "expectedOutput": "..." }],
      "constraints": ["Time complexity: ...", "Space: ..."]
    }
  ]
}`;
    } else if (type === 'qa') {
        subPrompt = `Create 5 deep-understanding open-ended questions. Do not generate any MCQs.`;
        jsonStructure = `{
  "title": "\${parsedJd.role} Q&A Assessment",
  "mcqs": [],
  "subjective": [
     {
       "question": "string",
       "evaluationCriteria": "Detailed strict criteria for evaluators"
     }
  ],
  "coding": []
}`;
    } else {
        subPrompt = `Create 5 multiple choice questions that test judgement and scenario application. Also output 2 open-ended scenario questions.`;
        jsonStructure = `{
  "title": "\${parsedJd.role} Scenario Assessment",
  "mcqs": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctOptionIndex": 0,
      "reasoning": "Why this tests judgement correctly"
    }
  ],
  "subjective": [
    {
      "question": "string",
      "evaluationCriteria": "What a good answer looks like exactly"
    }
  ],
  "coding": []
}`;
    }

    const prompt = `You are designing a screening assessment for the following role:
Role: ${parsedJd.role}
Seniority: ${parsedJd.seniority}
Domain: ${parsedJd.domain}
Primary Skills: ${parsedJd.coreSkillsRequired.join(', ')}
What separates great from good: ${parsedJd.differentiatingFactors.join(', ')}

${subPrompt}

Return EXACTLY the following JSON structure:
${jsonStructure}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error('Error generating assessment:', error);
        throw new Error('Failed to generate assessment using Gemini.');
    }
}

/**
 * Evaluates a candidate's subjective questions using Gemini.
 */
async function evaluateCandidate(candidateAnswers, assessmentConfig) {
    const prompt = `You are a strict, highly accurate AI assessor.
Evaluate the candidate's answers based directly on the provided assessment configuration.

Assessment Config:
${JSON.stringify(assessmentConfig, null, 2)}

Candidate Answers:
${JSON.stringify(candidateAnswers, null, 2)}

Provide scoring and feedback in this EXACT JSON structure:
{
  "mcqScore": 0, // out of total MCQs
  "subjectiveScore": 0, // out of 100
  "strengths": ["array of strings"],
  "weaknesses": ["array of strings"],
  "overallRecommendation": "Advance | Reject | Hold",
  "reasoning": "Detailed justification."
}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error('Error strictly evaluating candidate:', error);
        throw new Error('Failed to evaluate candidate using Gemini.');
    }
}

module.exports = {
    parseJobDescription,
    generateAssessment,
    evaluateCandidate
};
