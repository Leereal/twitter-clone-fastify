import crypto from 'crypto';
import { string } from 'zod';

// Function to hash the password
export function hashPassword(password: string) {
  // Generate a random salt
  const salt = crypto.randomBytes(16).toString('hex');
  // Hash the password using PBKDF2 with 1000 iterations and SHA-512 algorithm
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  // Return the hash and the salt
  return { hash, salt };
}

// Function to verify the password
export function verifyPassword({
  candidatePassword,
  salt,
  hash,
}: {
  candidatePassword: string;
  salt: string;
  hash: string;
}) {
  // Hash the candidate password using the provided salt
  const candidateHash = crypto
    .pbkdf2Sync(candidatePassword, salt, 1000, 64, 'sha512')
    .toString('hex');
  // Compare the candidate hash with the stored hash
  return candidateHash === hash;
}
