import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { IUserAccount } from '@meadsoft/auth-contracts';
import {
    UserAccountRepository,
    UserLoginMethodRepository,
} from '../database/repositories/user-account.repo';
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const SCRYPT_KEY_LENGTH = 64;
const SALT_BYTE_LENGTH = 16;

type LoginProvider = 'local' | 'google';

@Injectable()
export class UserAccountService {
    constructor(
        private readonly userAccountRepo: UserAccountRepository,
        private readonly loginMethodRepo: UserLoginMethodRepository,
    ) {}

    async findOrCreateFromFirebase(
        decoded: DecodedIdToken,
    ): Promise<IUserAccount> {
        const firebaseUid = decoded.uid;
        const email = decoded.email ?? null;
        const displayName = decoded.name ?? email ?? null;
        const iamRoles = this.extractIamRoles(decoded);
        const provider = this.mapProvider(
            decoded.firebase?.sign_in_provider ?? '',
        );

        let user = await this.userAccountRepo.findByFirebaseUid(firebaseUid);

        if (!user && email) {
            user = await this.userAccountRepo.findByEmail(email);
        }

        if (!user) {
            const now = new Date().toISOString();
            user = await this.userAccountRepo.createOne({
                id: crypto.randomUUID(),
                email,
                displayName,
                firebaseUid,
                iamRoles,
                isActive: true,
                createdDate: now,
                updatedDate: now,
                createdById: null,
                updatedById: null,
            });
        } else {
            const updates: Partial<IUserAccount> = {
                updatedDate: new Date().toISOString(),
            };
            if (!user.firebaseUid) {
                updates.firebaseUid = firebaseUid;
            }
            if (iamRoles.length > 0) {
                updates.iamRoles = iamRoles;
            }
            user = await this.userAccountRepo.updateOne(user.id, updates);
        }

        await this.ensureLoginMethod(user.id, {
            provider,
            providerUserId: firebaseUid,
            providerEmail: email,
        });

        return user;
    }

    private async ensureLoginMethod(
        userId: string,
        opts: {
            provider: LoginProvider;
            providerUserId: string;
            providerEmail: string | null;
        },
    ): Promise<void> {
        const existing = await this.loginMethodRepo.findByUserIdAndProvider(
            userId,
            opts.provider,
        );
        if (existing) return;

        await this.loginMethodRepo.createOne({
            id: crypto.randomUUID(),
            userId,
            provider: opts.provider,
            providerUserId: opts.providerUserId,
            providerEmail: opts.providerEmail,
            isActive: true,
            linkedAt: new Date().toISOString(),
        });
    }

    async registerLocal(
        email: string,
        password: string,
        displayName?: string,
    ): Promise<IUserAccount> {
        const existing = await this.userAccountRepo.findByEmail(email);
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const passwordHash = await this.hashPassword(password);
        const now = new Date().toISOString();

        const user = await this.userAccountRepo.createOneWithPassword(
            {
                id: crypto.randomUUID(),
                email,
                displayName: displayName ?? null,
                firebaseUid: null,
                iamRoles: [],
                isActive: true,
                createdDate: now,
                updatedDate: now,
                createdById: null,
                updatedById: null,
            },
            passwordHash,
        );

        await this.ensureLoginMethod(user.id, {
            provider: 'local',
            providerUserId: user.id,
            providerEmail: email,
        });

        return user;
    }

    async validateLocalCredentials(
        email: string,
        password: string,
    ): Promise<IUserAccount> {
        const record =
            await this.userAccountRepo.findPasswordHashByEmail(email);
        if (!record) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const valid = await this.verifyPassword(password, record.passwordHash);
        if (!valid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const user = await this.userAccountRepo.findOne(record.id);
        if (!user || !user.isActive) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return user;
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

    private mapProvider(signInProvider: string): LoginProvider {
        if (signInProvider === 'google.com') return 'google';
        return 'local';
    }

    private extractIamRoles(decoded: DecodedIdToken): string[] {
        const roles = (decoded as Record<string, unknown>)['roles'];
        if (Array.isArray(roles)) {
            return roles.filter((r): r is string => typeof r === 'string');
        }
        return [];
    }
}
