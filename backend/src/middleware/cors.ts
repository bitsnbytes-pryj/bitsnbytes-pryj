import cors from 'cors';
import { config } from '../config/index.js';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Check if origin is allowed
    if (config.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    // In development, allow all origins
    if (config.nodeEnv === 'development') {
      callback(null, true);
      return;
    }

    // Reject the request
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
});