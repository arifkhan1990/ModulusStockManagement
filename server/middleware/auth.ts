import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Using any to allow for full user object with permissions
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is required' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Authorization header format is Bearer <token>' });
  }

  const token = parts[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, config.auth.jwtSecret) as { id: string; email: string };

    // Fetch complete user data including role and permissions
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'User account is inactive or suspended' });
    }

    // Update last login time
    await User.findByIdAndUpdate(decoded.id, { lastLogin: new Date() });

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};