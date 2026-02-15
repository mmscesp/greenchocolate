// AES-256-GCM Encryption Service for PII Protection
// Simplified for MVP: Single bundle encryption per user

import { createCipheriv, createDecipheriv, createHash, randomBytes, scryptSync } from 'crypto';
import { getServerEnv } from '@/lib/env';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32;

// Get master key from environment (never stored in DB)
function getMasterKey(): Buffer {
  const env = getServerEnv();
  const key = env.APP_MASTER_KEY;

  // Derive a proper 32-byte key from the hex string with unique salt
  const salt = env.ENCRYPTION_SALT;
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
  private static encryptInternal(data: unknown): string {
    const masterKey = getMasterKey();
    const iv = randomBytes(IV_LENGTH);

    const cipher = createCipheriv(ALGORITHM, masterKey, iv);
    const dataString = JSON.stringify(data);
    const encrypted = Buffer.concat([
      cipher.update(dataString, 'utf8'),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();
    const bundle: EncryptedBundle = {
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      ciphertext: encrypted.toString('hex'),
    };

    return Buffer.from(JSON.stringify(bundle)).toString('base64');
  }

  private static decryptInternal(encryptedBundle: string): unknown {
    const masterKey = getMasterKey();

    const bundle: EncryptedBundle = JSON.parse(
      Buffer.from(encryptedBundle, 'base64').toString('utf8')
    );

    const decipher = createDecipheriv(
      ALGORITHM,
      masterKey,
      Buffer.from(bundle.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(bundle.authTag, 'hex'));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(bundle.ciphertext, 'hex')),
      decipher.final(),
    ]);

    return JSON.parse(decrypted.toString('utf8'));
  }

  /**
   * Encrypt PII data bundle
   * Returns base64-encoded JSON string for storage
   */
  static encrypt(data: PIIData): string {
    return this.encryptInternal(data);
  }

  /**
   * Alias for encrypt (matches architecture plan)
   */
  static encryptPII(data: PIIData): string {
    return this.encrypt(data);
  }

  /**
   * Decrypt PII data bundle
   */
  static decrypt(encryptedBundle: string): PIIData {
    try {
      return this.decryptInternal(encryptedBundle) as PIIData;
    } catch (error) {
      throw new Error('Failed to decrypt data: Invalid or corrupted data');
    }
  }

  static encryptPayload(data: Record<string, unknown>): string {
    return this.encryptInternal(data);
  }

  static decryptPayload(encryptedBundle: string): Record<string, unknown> {
    try {
      return this.decryptInternal(encryptedBundle) as Record<string, unknown>;
    } catch (error) {
      throw new Error('Failed to decrypt payload: Invalid or corrupted data');
    }
  }

  /**
   * Alias for decrypt (matches architecture plan)
   */
  static decryptPII(encryptedBundle: string): PIIData {
    return this.decrypt(encryptedBundle);
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
