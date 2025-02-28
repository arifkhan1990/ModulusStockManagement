
import crypto from 'crypto';
import config from '../config';

// Default encryption key and IV (in production, these would be in environment variables)
const DEFAULT_ENCRYPTION_KEY = config.encryption?.key || 'this-is-a-32-byte-encryption-key!';
const DEFAULT_ENCRYPTION_IV = config.encryption?.iv || 'a-16-byte-iv-val';

/**
 * Encrypt sensitive data
 * @param text Plain text to encrypt
 * @param key Custom encryption key (optional)
 * @param iv Custom initialization vector (optional)
 * @returns Encrypted text
 */
export const encrypt = async (
  text: string, 
  key: string = DEFAULT_ENCRYPTION_KEY,
  iv: string = DEFAULT_ENCRYPTION_IV
): Promise<string> => {
  try {
    // Create key and iv buffers
    const keyBuffer = Buffer.from(key.slice(0, 32).padEnd(32, '0'));
    const ivBuffer = Buffer.from(iv.slice(0, 16).padEnd(16, '0'));
    
    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
    
    // Encrypt data
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt sensitive data
 * @param encryptedText Encrypted text
 * @param key Custom encryption key (optional)
 * @param iv Custom initialization vector (optional)
 * @returns Decrypted text
 */
export const decrypt = async (
  encryptedText: string,
  key: string = DEFAULT_ENCRYPTION_KEY,
  iv: string = DEFAULT_ENCRYPTION_IV
): Promise<string> => {
  try {
    // Create key and iv buffers
    const keyBuffer = Buffer.from(key.slice(0, 32).padEnd(32, '0'));
    const ivBuffer = Buffer.from(iv.slice(0, 16).padEnd(16, '0'));
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
    
    // Decrypt data
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

export const encryption = {
  encrypt,
  decrypt
};
