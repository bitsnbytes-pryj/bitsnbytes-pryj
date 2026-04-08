import * as jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { JwtPayload } from '../types/auth.types.js';

// Generate a JWT token
export function generateToken(payload: {
  userId: string;
  email: string;
  role: string;
}): string {
  const secret: jwt.Secret = config.jwt.secret;
  const options: jwt.SignOptions = { 
    expiresIn: '7d' // 7 days default
  };
  return jwt.sign(payload, secret, options);
}

// Verify a JWT token
export function verifyToken(token: string): JwtPayload | null {
  try {
    const secret: jwt.Secret = config.jwt.secret;
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}

// Decode a JWT token without verification
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}

// Get token expiration date
export function getTokenExpiration(token: string): Date | null {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  return new Date(decoded.exp * 1000);
}

// Extract token from Authorization header
export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}