export function normalizePhone(raw: string): string {
  const value = raw.replace(/\s|\(|\)|-/g, '');

  if (/^\+\d{10,15}$/.test(value)) return value;

  if (/^07\d{9}$/.test(value)) {
    return `+44${value.slice(1)}`;
  }

  if (/^\d{10}$/.test(value)) {
    return `+1${value}`;
  }

  throw new Error('Invalid phone number. Use E.164, US 10-digit, or UK 07xxxxxxxxx.');
}
