/**
 * Password Utilities
 *
 * Hashing and verification using Node's built-in `crypto.scrypt`.
 *
 * Storage format: `scrypt$<salt-hex>$<hash-hex>`
 *   - Algorithm tag is `scrypt` (future-proofs against algorithm changes)
 *   - Salt is 16 random bytes, hex-encoded
 *   - Hash is the 64-byte scrypt-derived key, hex-encoded
 *
 * Verification uses `crypto.timingSafeEqual` to prevent timing attacks.
 */

const crypto = require('crypto');

const ALGORITHM = 'scrypt';
const KEY_LENGTH = 64;

/**
 * Hash a plaintext password for storage.
 *
 * @param {string} password - Plaintext password to hash
 * @returns {string} Encoded hash in format `scrypt$<salt>$<hash>`
 */
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${ALGORITHM}$${salt}$${hash}`;
};

/**
 * Verify a plaintext password against a stored hash.
 *
 * @param {string} password - Plaintext password to verify
 * @param {string} passwordHash - Stored hash in format `scrypt$<salt>$<hash>`
 * @returns {boolean} `true` if the password matches, `false` otherwise
 */
const verifyPassword = (password, passwordHash) => {
  if (!passwordHash) {
    return false;
  }

  const [algorithm, salt, storedHash] = passwordHash.split('$');
  if (algorithm !== ALGORITHM || !salt || !storedHash) {
    return false;
  }

  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH);
  const storedKey = Buffer.from(storedHash, 'hex');

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedKey, derivedKey);
};

module.exports = { hashPassword, verifyPassword };
