import { randomBytes } from 'node:crypto';
import { encrypt, decrypt } from './crypto.utils';

describe('crypto.utils', () => {
  const ORIGINAL_ENV = process.env.ENCRYPTION_KEY;

  afterEach(() => {
    process.env.ENCRYPTION_KEY = ORIGINAL_ENV;
  });

  it('round-trips plaintext through encrypt and decrypt', () => {
    process.env.ENCRYPTION_KEY = randomBytes(32).toString('hex');

    const { content, iv } = encrypt('hello world');
    expect(decrypt(content, iv)).toBe('hello world');
  });

  it('produces a different iv and ciphertext on each call', () => {
    process.env.ENCRYPTION_KEY = randomBytes(32).toString('hex');

    const first = encrypt('same input');
    const second = encrypt('same input');

    expect(first.iv).not.toBe(second.iv);
    expect(first.content).not.toBe(second.content);
  });

  it('throws when ENCRYPTION_KEY is not set', () => {
    delete process.env.ENCRYPTION_KEY;

    expect(() => encrypt('hello')).toThrow('ENCRYPTION_KEY is not set');
  });

  it('throws when decrypting with a tampered ciphertext (auth tag mismatch)', () => {
    process.env.ENCRYPTION_KEY = randomBytes(32).toString('hex');

    const { content, iv } = encrypt('hello world');
    const tampered = Buffer.from(content, 'base64');
    tampered[tampered.length - 1] ^= 0xff;

    expect(() => decrypt(tampered.toString('base64'), iv)).toThrow();
  });

  it('throws when decrypting with the wrong iv', () => {
    process.env.ENCRYPTION_KEY = randomBytes(32).toString('hex');

    const { content } = encrypt('hello world');
    const wrongIv = randomBytes(16).toString('hex');

    expect(() => decrypt(content, wrongIv)).toThrow();
  });
});
