import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';

const getKey = (): Buffer => {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error('ENCRYPTION_KEY is not set');
  }

  return Buffer.from(key, 'hex');
};

export const encrypt = (plaintext: string): { content: string; iv: string } => {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);

  const authTag = cipher.getAuthTag();

  const content = Buffer.concat([authTag, encrypted]).toString('base64');

  return {
    content,
    iv: iv.toString('hex'),
  };
};

export const decrypt = (content: string, iv: string) => {
  const data = Buffer.from(content, 'base64');

  const authTag = data.subarray(0, 16);
  const encrypted = data.subarray(16);

  const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(iv, 'hex'));
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
};
