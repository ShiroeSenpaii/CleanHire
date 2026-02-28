import { describe, expect, it } from 'vitest';
import { generateMagicToken, hashToken, verifyToken } from '@/lib/auth/token';

describe('token utils', () => {
  it('generates distinct tokens', () => {
    const a = generateMagicToken();
    const b = generateMagicToken();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(20);
  });

  it('verifies valid token hash pair', () => {
    const token = generateMagicToken();
    const hash = hashToken(token);
    expect(verifyToken(token, hash)).toBe(true);
    expect(verifyToken('bad', hash)).toBe(false);
  });
});
