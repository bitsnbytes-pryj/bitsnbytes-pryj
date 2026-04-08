import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database (keep for backwards compatibility)
  databaseUrl: process.env.DATABASE_URL || '',
  
  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // Password hashing
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  },
  
  // CORS
  cors: {
    origins: (process.env.CORS_ORIGIN || 'http://localhost:3001')
      .split(',')
      .map(origin => origin.trim()),
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  // Login rate limiting (more restrictive)
  loginRateLimit: {
    windowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.LOGIN_RATE_LIMIT_MAX_REQUESTS || '5', 10),
  },
  
  // Derived values
  get isDevelopment() {
    return this.nodeEnv === 'development';
  },
  
  get isProduction() {
    return this.nodeEnv === 'production';
  },
  
  get isTest() {
    return this.nodeEnv === 'test';
  },
} as const;

// Validate required environment variables
export function validateConfig(): void {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  if (config.jwt.secret === 'default-secret-change-in-production' && config.isProduction) {
    throw new Error('JWT_SECRET must be changed in production environment');
  }
}

export default config;