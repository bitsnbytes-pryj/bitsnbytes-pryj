import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
  // Use IP address as key
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
});

// Stricter rate limiter for form submissions
export const formRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 submissions per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many form submissions. Please try again later.',
  },
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
});