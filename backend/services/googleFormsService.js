const { google } = require('googleapis');

async function publishToGoogleForms(assessment) {
    try {
        // Because a proper OAuth flow is complex for a simple MVP (requiring a consent screen),
        // we'll attempt to use application default credentials or a service account if available.
        // If not, we throw an error instructing the user.
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            throw new Error('Google Forms publishing requires GOOGLE_APPLICATION_CREDENTIALS environment variable pointing to a service-account.json');
        }

        const auth = new google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/forms.body']
        });
        
        const forms = google.forms({ version: 'v1', auth });

        // 1. Create a blank form
        const newForm = {
            info: {
                title: assessment.title || "AI Generated Assessment",
                documentTitle: assessment.title || "AI Generated Assessment"
            }
        };
        const createRes = await forms.forms.create({ requestBody: newForm });
        const formId = createRes.data.formId;

        // 2. Add MCQs
        const requests = [];
        let index = 0;

        if (assessment.mcqs) {
            for (const mcq of assessment.mcqs) {
                requests.push({
                    createItem: {
                        item: {
                            title: mcq.question,
                            questionItem: {
                                question: {
                                    required: true,
                                    choiceQuestion: {
                                        type: 'RADIO',
                                        options: mcq.options.map(o => ({ value: o }))
                                    }
                                }
                            }
                        },
                        location: { index: index++ }
                    }
                });
            }
        }

        if (assessment.subjective) {
            for (const sub of assessment.subjective) {
                requests.push({
                    createItem: {
                        item: {
                            title: sub.question,
                            questionItem: {
                                question: {
                                    required: true,
                                    textQuestion: { paragraph: true }
                                }
                            }
                        },
                        location: { index: index++ }
                    }
                });
            }
        }

        if (requests.length > 0) {
            await forms.forms.batchUpdate({
                formId: formId,
                requestBody: { requests }
            });
        }

        return `https://docs.google.com/forms/d/${formId}/viewform`;
    } catch (e) {
        console.error("Google Forms Publishing Error:", e.message);
        throw e;
    }
}

module.exports = {
    publishToGoogleForms
};
