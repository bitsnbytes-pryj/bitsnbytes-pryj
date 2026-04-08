import { config } from '../config/index.js';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatTimestamp(): string {
  return new Date().toISOString();
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const timestamp = formatTimestamp();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(meta && { meta }),
  };
  
  // In development, pretty print; in production, JSON
  if (config.nodeEnv === 'development') {
    const levelColors = {
      info: '\x1b[36m',  // cyan
      warn: '\x1b[33m',  // yellow
      error: '\x1b[31m', // red
      debug: '\x1b[90m', // gray
    };
    const reset = '\x1b[0m';
    console.log(
      `${levelColors[level]}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}`,
      meta ? JSON.stringify(meta, null, 2) : ''
    );
  } else {
    console.log(JSON.stringify(logEntry));
  }
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (config.nodeEnv === 'development') {
      log('debug', message, meta);
    }
  },
};