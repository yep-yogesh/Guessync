import admin from 'firebase-admin';
import serviceAccount from './firebase-adminsdk.js'; // this is now JS

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.error("No authorization header provided");
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      console.error("No token found in authorization header");
      return res.status(401).json({ message: 'Invalid authorization format' });
    }

    if (token === "guest") {
      req.uid = "guest";
      return next();
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.uid = decoded.uid;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ 
      message: 'Unauthorized',
      error: err.message 
    });
  }
};
