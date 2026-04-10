import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // CORS
  cors: {
    origins: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '500', 10),
    loginWindowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || '900000', 10),
    loginMaxRequests: parseInt(process.env.LOGIN_RATE_LIMIT_MAX_REQUESTS || '5', 10),
  },
  
  // Password Hashing
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  },
  
  // SMTP / Email
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    appPassword: process.env.SMTP_APP_PASSWORD || '',
  },
  
  // Admin Email (for notifications)
  adminEmail: process.env.ADMIN_EMAIL || 'admin@bnbprayagraj.com',
  
  // Webhook API Key (for external services)
  webhookApiKey: process.env.WEBHOOK_API_KEY || 'your-webhook-api-key-change-in-production',
} as const;

export default config;