import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { IPrinciple, LoginProviderEnum } from '@meadsoft/iam-contracts';
import {
    PrincipleRepository,
    PrincipleLoginMethodRepository,
} from '../database/repositories/principle.repo';
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { v7 as uuidv7 } from 'uuid';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const SCRYPT_KEY_LENGTH = 64;
const SALT_BYTE_LENGTH = 16;

@Injectable()
export class PrincipleLoginMethodService {
    constructor(
        private readonly principleRepo: PrincipleRepository,
        private readonly loginMethodRepo: PrincipleLoginMethodRepository,
    ) {}

    /**
     * Ensures that a login method record exists for the given principle and provider details. If a record already exists, no action is taken. If no record exists, a new one is created.
     * @param principleId the ID of the principle to ensure the login method exists for
     * @param opts the login method details to ensure
     * @returns the created or existing login method record
     */
    private async ensureLoginMethod(
        principleId: string,
        opts: {
            provider: LoginProviderEnum;
            providerPrincipleId: string;
            providerEmail: string | null;
        },
    ): Promise<void> {
        const existing =
            await this.loginMethodRepo.findByPrincipleIdAndProvider(
                principleId,
                opts.provider,
            );
        if (existing) return;

        await this.loginMethodRepo.createOne({
            id: uuidv7(),
            principleId,
            provider: opts.provider,
            providerPrincipleId: opts.providerPrincipleId,
            providerEmail: opts.providerEmail,
            isActive: true,
            linkedAt: new Date().toISOString(),
        });
    }

    async validateLocalCredentials(
        email: string,
        password: string,
    ): Promise<IPrinciple> {
        const record = await this.principleRepo.findPasswordHashByEmail(email);
        if (!record) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const valid = await this.verifyPassword(password, record.passwordHash);
        if (!valid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const principle = await this.principleRepo.findOne(record.id);
        if (!(principle?.isActive ?? false)) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return principle;
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = randomBytes(SALT_BYTE_LENGTH).toString('hex');
        const derivedKey = (await scryptAsync(
            password,
            salt,
            SCRYPT_KEY_LENGTH,
        )) as Buffer;
        return `${salt}:${derivedKey.toString('hex')}`;
    }

    private async verifyPassword(
        password: string,
        hash: string,
    ): Promise<boolean> {
        const [salt, key] = hash.split(':');
        const derivedKey = (await scryptAsync(
            password,
            salt,
            SCRYPT_KEY_LENGTH,
        )) as Buffer;
        const keyBuffer = Buffer.from(key, 'hex');
        return timingSafeEqual(derivedKey, keyBuffer);
    }
}
