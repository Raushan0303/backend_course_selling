import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/config.js";
import User from '../models/users.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    try {
      const user = await User.findById(payload.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;  
      next();
    } catch (error) {
      console.error('Error in authenticateToken middleware:', error);
      return res.status(500).json({ message: "Server error", error });
    }
  });
};

export const requireInstructorRole = (req, res, next) => {
  if (req.user.role !== 'Instructor') {
    return res.status(403).json({ message: "Only instructors are allowed to perform this action" });
  }
  next();
};
