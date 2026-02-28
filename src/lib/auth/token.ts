import crypto from 'crypto';

export function generateMagicToken() {
  return crypto.randomBytes(24).toString('hex');
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function verifyToken(rawToken: string, storedHash: string): boolean {
  return hashToken(rawToken) === storedHash;
}
