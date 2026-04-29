import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const SCRYPT_KEY_LENGTH = 64;
const SALT_BYTE_LENGTH = 16;

export class SaltingService {
    async salt(value: string): Promise<string> {
        const salt = randomBytes(SALT_BYTE_LENGTH).toString('hex');
        const derivedKey = (await scryptAsync(
            value,
            salt,
            SCRYPT_KEY_LENGTH,
        )) as Buffer;
        return `${salt}:${derivedKey.toString('hex')}`;
    }

    async verify(value: string, hash: string): Promise<boolean> {
        const [salt, key] = hash.split(':');
        const derivedKey = (await scryptAsync(
            value,
            salt,
            SCRYPT_KEY_LENGTH,
        )) as Buffer;
        const keyBuffer = Buffer.from(key, 'hex');
        return timingSafeEqual(derivedKey, keyBuffer);
    }
}
