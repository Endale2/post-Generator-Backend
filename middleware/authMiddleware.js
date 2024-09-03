import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
  console.log('Cookies:', req.cookies); // Debugging

  try {
    // Extract token from cookies
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error); // Debugging
    return res.status(401).json({ message: 'Invalid token' });
  }
};
