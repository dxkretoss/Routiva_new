// Secure Password Hashing Utility using Web Crypto SHA-256

export async function hashPassword(password) {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_routiva_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `sha256$${hashHex}`;
}

export async function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;
  // If stored in plain (legacy migration), compare directly or hash
  if (!storedHash.startsWith('sha256$')) {
    return password === storedHash;
  }
  const hashedInput = await hashPassword(password);
  return hashedInput === storedHash;
}
