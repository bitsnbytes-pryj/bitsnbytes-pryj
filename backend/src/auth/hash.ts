import bcrypt from 'bcrypt';
import { config } from '../config/index.js';

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, config.bcrypt.rounds);
}

// Compare a password with a hash
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}