// AES-256-GCM Encryption Service for PII Protection
// Simplified for MVP: Single bundle encryption per user

import { createCipheriv, createDecipheriv, createHash, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32;

// Get master key from environment (never stored in DB)
function getMasterKey(): Buffer {
  const key = process.env.APP_MASTER_KEY;
  if (!key) {
    throw new Error('APP_MASTER_KEY environment variable is not set');
  }

  // Derive a proper 32-byte key from the hex string with unique salt
  const salt = process.env.ENCRYPTION_SALT || 'default-salt-change-in-production';
  return scryptSync(key, salt, KEY_LENGTH);
}

/**
 * PII Data Interface
 */
export interface PIIData {
  fullName?: string;
  phone?: string;
  birthDate?: string;
  nationality?: string;
}

/**
 * Encrypted Bundle Interface
 */
export interface EncryptedBundle {
  iv: string;       // Initialization vector (hex)
  authTag: string;  // Authentication tag (hex)
  ciphertext: string; // Encrypted data (hex)
}

/**
 * Encryption Service
 * Uses AES-256-GCM for authenticated encryption
 */
export class EncryptionService {
  /**
   * Encrypt PII data bundle
   * Returns base64-encoded JSON string for storage
   */
  static encrypt(data: PIIData): string {
    const masterKey = getMasterKey();
    const iv = randomBytes(IV_LENGTH);
    
    // Create cipher
    const cipher = createCipheriv(ALGORITHM, masterKey, iv);
    
    // Encrypt the data
    const dataString = JSON.stringify(data);
    const encrypted = Buffer.concat([
      cipher.update(dataString, 'utf8'),
      cipher.final(),
    ]);
    
    // Get authentication tag
    const authTag = cipher.getAuthTag();
    
    // Create bundle
    const bundle: EncryptedBundle = {
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      ciphertext: encrypted.toString('hex'),
    };
    
    return Buffer.from(JSON.stringify(bundle)).toString('base64');
  }

  /**
   * Decrypt PII data bundle
   */
  static decrypt(encryptedBundle: string): PIIData {
    const masterKey = getMasterKey();
    
    try {
      // Parse bundle
      const bundle: EncryptedBundle = JSON.parse(
        Buffer.from(encryptedBundle, 'base64').toString('utf8')
      );
      
      // Create decipher
      const decipher = createDecipheriv(
        ALGORITHM,
        masterKey,
        Buffer.from(bundle.iv, 'hex')
      );
      
      // Set auth tag
      decipher.setAuthTag(Buffer.from(bundle.authTag, 'hex'));
      
      // Decrypt
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(bundle.ciphertext, 'hex')),
        decipher.final(),
      ]);
      
      return JSON.parse(decrypted.toString('utf8'));
    } catch (error) {
      throw new Error('Failed to decrypt data: Invalid or corrupted data');
    }
  }

  /**
   * Generate a secure random key (for testing/development)
   */
  static generateKey(): string {
    return randomBytes(KEY_LENGTH).toString('hex');
  }

  /**
    * Generate SHA-256 hash for non-reversible data (e.g., consent metadata)
    */
  static hash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }
}

// Export type helpers
export type { EncryptedBundle as EncryptionBundle };
