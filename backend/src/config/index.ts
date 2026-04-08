import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  port: z.number().default(3000),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  supabase: z.object({
    url: z.string().url(),
    anonKey: z.string(),
    serviceRoleKey: z.string(),
  }),
  smtp: z.object({
    host: z.string().default('smtp.gmail.com'),
    port: z.number().default(587),
    user: z.string(),
    appPassword: z.string(),
  }),
  adminEmail: z.string().email(),
  corsOrigins: z.array(z.string()),
  rateLimit: z.object({
    windowMs: z.number().default(900000), // 15 minutes
    maxRequests: z.number().default(100),
  }),
});

type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
  const corsOrigins = process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()) ?? [
    'http://localhost:3000',
  ];

  return configSchema.parse({
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    supabase: {
      url: process.env.SUPABASE_URL ?? '',
      anonKey: process.env.SUPABASE_ANON_KEY ?? '',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    },
    smtp: {
      host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT ?? '587', 10),
      user: process.env.SMTP_USER ?? '',
      appPassword: process.env.SMTP_APP_PASSWORD ?? '',
    },
    adminEmail: process.env.ADMIN_EMAIL ?? 'bitsnbytes.prayagraj@gmail.com',
    corsOrigins,
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '900000', 10),
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? '100', 10),
    },
  });
}

export const config = loadConfig();
export type { Config };