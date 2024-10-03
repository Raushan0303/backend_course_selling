import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/config.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({ message: "Invalid token" });
    }
    console.log('Token verified, user:', user);
    req.user = user;
    next();
  });
};