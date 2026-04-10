import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// Generate a JWT token
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as string,
  } as jwt.SignOptions);
}

// Verify a JWT token
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  } catch {
    return null;
  }
}

// Extract Bearer token from Authorization header
export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

// Get token expiration date
export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    if (!decoded || !decoded.exp) return null;
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}