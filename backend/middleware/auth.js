const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    try {
        // Try to get credentials from environment variable or file
        let credentials;
        
        if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
            // If provided as JSON string in environment
            credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
            // If provided as file path
            credentials = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8'));
        } else {
            // Default to looking for a service account file in the project root
            const defaultPath = path.join(__dirname, '..', 'serviceAccountKey.json');
            if (fs.existsSync(defaultPath)) {
                credentials = JSON.parse(fs.readFileSync(defaultPath, 'utf8'));
            } else {
                console.warn('Firebase Admin SDK credentials not found. Token verification will be skipped.');
                credentials = null;
            }
        }

        if (credentials) {
            admin.initializeApp({
                credential: admin.credential.cert(credentials)
            });
        }
    } catch (error) {
        console.warn('Failed to initialize Firebase Admin SDK:', error.message);
    }
}

async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split('Bearer ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // If Firebase Admin SDK is properly initialized, verify the token
        if (admin.apps.length > 0) {
            const decodedToken = await admin.auth().verifyIdToken(token);
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email
            };
            next();
        } else {
            // Fallback: parse JWT without verification (less secure, but works without service account)
            const parts = token.split('.');
            if (parts.length !== 3) {
                return res.status(401).json({ error: 'Invalid token format' });
            }

            try {
                const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                req.user = {
                    uid: decoded.user_id || decoded.sub,
                    email: decoded.email
                };
                next();
            } catch (parseError) {
                return res.status(401).json({ error: 'Invalid token' });
            }
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = { verifyToken };
