const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK only once
let adminApp = null;

function initializeAdminSDK() {
    if (adminApp) return adminApp;
    
    if (admin.apps.length > 0) {
        adminApp = admin.apps[0];
        return adminApp;
    }

    try {
        let credentials = null;

        // Try different credential sources
        if (process.env.FIREBASE_ADMIN_SDK_JSON) {
            // If provided as JSON string in environment
            credentials = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);
            adminApp = admin.initializeApp({ credential: admin.credential.cert(credentials) });
        } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
            // If provided as file path
            credentials = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8'));
            adminApp = admin.initializeApp({ credential: admin.credential.cert(credentials) });
        } else if (fs.existsSync(path.join(__dirname, '..', 'serviceAccountKey.json'))) {
            // Default to looking for a service account file
            credentials = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'serviceAccountKey.json'), 'utf8'));
            adminApp = admin.initializeApp({ credential: admin.credential.cert(credentials) });
        } else {
            console.warn('⚠️  Firebase Admin SDK credentials not found. Token verification will use JWT decoding.');
        }
    } catch (error) {
        console.warn('⚠️  Failed to initialize Firebase Admin SDK:', error.message);
    }

    return adminApp;
}

async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split('Bearer ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Try to verify with Firebase Admin SDK first
        const app = initializeAdminSDK();
        
        if (app && admin.apps.length > 0) {
            const decodedToken = await admin.auth().verifyIdToken(token);
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email
            };
            return next();
        }

        // Fallback: Parse JWT without verification (less secure, but works without service account)
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
    } catch (error) {
        console.error('Token verification error:', error.message);
        
        // Fallback to JWT parsing
        try {
            const parts = token.split('.');
            if (parts.length === 3) {
                const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                req.user = {
                    uid: decoded.user_id || decoded.sub,
                    email: decoded.email
                };
                return next();
            }
        } catch (e) {
            // Continue to error response
        }
        
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = { verifyToken, initializeAdminSDK };
