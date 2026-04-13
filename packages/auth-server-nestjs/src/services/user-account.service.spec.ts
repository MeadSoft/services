import type { DecodedIdToken } from 'firebase-admin/auth';
import type { IUserAccount } from '@meadsoft/auth-contracts';
import { UserAccountService } from './user-account.service';
import {
    UserAccountRepository,
    UserLoginMethodRepository,
} from '../database/repositories/user-account.repo';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('UserAccountService', () => {
    const buildDecodedToken = (
        overrides: Partial<DecodedIdToken> = {},
    ): DecodedIdToken => {
        return {
            uid: 'firebase-uid-1',
            email: 'new-user@meadsoft.com',
            name: 'New User',
            firebase: { sign_in_provider: 'google.com' },
            roles: ['user'],
            ...overrides,
        } as DecodedIdToken;
    };

    const buildUser = (
        overrides: Partial<IUserAccount> = {},
    ): IUserAccount => ({
        id: 'f2b3a854-8bd7-4539-ae50-f7dcb8fa9e17',
        email: 'new-user@meadsoft.com',
        displayName: 'New User',
        firebaseUid: 'firebase-uid-1',
        iamRoles: ['user'],
        isActive: true,
        createdDate: '2026-01-01T00:00:00.000Z',
        updatedDate: '2026-01-01T00:00:00.000Z',
        createdById: null,
        updatedById: null,
        ...overrides,
    });

    it('creates a user and login method when firebase uid and email are unknown', async () => {
        const created = buildUser();
        const accountRepo = {
            findByFirebaseUid: jest.fn().mockResolvedValue(null),
            findByEmail: jest.fn().mockResolvedValue(null),
            createOne: jest.fn().mockResolvedValue(created),
            updateOne: jest.fn(),
        } as unknown as UserAccountRepository;

        const loginRepo = {
            findByUserIdAndProvider: jest.fn().mockResolvedValue(null),
            createOne: jest.fn().mockResolvedValue(undefined),
        } as unknown as UserLoginMethodRepository;

        const service = new UserAccountService(accountRepo, loginRepo);

        const result =
            await service.findOrCreateFromFirebase(buildDecodedToken());

        expect(result).toEqual(created);
        expect(accountRepo.findByFirebaseUid).toHaveBeenCalledWith(
            'firebase-uid-1',
        );
        expect(accountRepo.findByEmail).toHaveBeenCalledWith(
            'new-user@meadsoft.com',
        );
        expect(accountRepo.createOne).toHaveBeenCalledTimes(1);
        expect(loginRepo.createOne).toHaveBeenCalledTimes(1);
    });

    it('updates existing user found by email and links firebase uid', async () => {
        const existing = buildUser({
            firebaseUid: null,
            iamRoles: ['old-role'],
        });
        const updated = buildUser({
            firebaseUid: 'firebase-uid-2',
            iamRoles: ['admin'],
        });

        const accountRepo = {
            findByFirebaseUid: jest.fn().mockResolvedValue(null),
            findByEmail: jest.fn().mockResolvedValue(existing),
            createOne: jest.fn(),
            updateOne: jest.fn().mockResolvedValue(updated),
        } as unknown as UserAccountRepository;

        const loginRepo = {
            findByUserIdAndProvider: jest.fn().mockResolvedValue(null),
            createOne: jest.fn().mockResolvedValue(undefined),
        } as unknown as UserLoginMethodRepository;

        const service = new UserAccountService(accountRepo, loginRepo);

        const result = await service.findOrCreateFromFirebase(
            buildDecodedToken({
                uid: 'firebase-uid-2',
                roles: ['admin'],
            } as Partial<DecodedIdToken>),
        );

        expect(result).toEqual(updated);
        expect(accountRepo.updateOne).toHaveBeenCalledWith(
            existing.id,
            expect.objectContaining({
                firebaseUid: 'firebase-uid-2',
                iamRoles: ['admin'],
            }),
        );
        expect(loginRepo.createOne).toHaveBeenCalledTimes(1);
    });

    it('does not create a duplicate login method when provider link already exists', async () => {
        const user = buildUser();
        const accountRepo = {
            findByFirebaseUid: jest.fn().mockResolvedValue(user),
            findByEmail: jest.fn(),
            createOne: jest.fn(),
            updateOne: jest.fn().mockResolvedValue(user),
        } as unknown as UserAccountRepository;

        const loginRepo = {
            findByUserIdAndProvider: jest
                .fn()
                .mockResolvedValue({ id: 'existing-login' }),
            createOne: jest.fn(),
        } as unknown as UserLoginMethodRepository;

        const service = new UserAccountService(accountRepo, loginRepo);

        await service.findOrCreateFromFirebase(buildDecodedToken());

        expect(loginRepo.findByUserIdAndProvider).toHaveBeenCalledWith(
            user.id,
            'google',
        );
        expect(loginRepo.createOne).not.toHaveBeenCalled();
    });

    describe('registerLocal', () => {
        it('creates a new user with a hashed password and local login method', async () => {
            const created = buildUser({ firebaseUid: null });
            const accountRepo = {
                findByEmail: jest.fn().mockResolvedValue(null),
                createOneWithPassword: jest.fn().mockResolvedValue(created),
            } as unknown as UserAccountRepository;

            const loginRepo = {
                findByUserIdAndProvider: jest.fn().mockResolvedValue(null),
                createOne: jest.fn().mockResolvedValue(undefined),
            } as unknown as UserLoginMethodRepository;

            const service = new UserAccountService(accountRepo, loginRepo);

            const result = await service.registerLocal(
                'new-user@meadsoft.com',
                'securePassword123',
                'New User',
            );

            expect(result).toEqual(created);
            expect(accountRepo.findByEmail).toHaveBeenCalledWith(
                'new-user@meadsoft.com',
            );
            expect(accountRepo.createOneWithPassword).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'new-user@meadsoft.com',
                    displayName: 'New User',
                    firebaseUid: null,
                }),
                expect.stringContaining(':'),
            );
            expect(loginRepo.createOne).toHaveBeenCalledTimes(1);
        });

        it('throws ConflictException when email already exists', async () => {
            const existing = buildUser();
            const accountRepo = {
                findByEmail: jest.fn().mockResolvedValue(existing),
            } as unknown as UserAccountRepository;

            const loginRepo = {} as unknown as UserLoginMethodRepository;

            const service = new UserAccountService(accountRepo, loginRepo);

            await expect(
                service.registerLocal(
                    'new-user@meadsoft.com',
                    'securePassword123',
                ),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('validateLocalCredentials', () => {
        it('returns the user when email and password are valid', async () => {
            const user = buildUser();

            const service = new UserAccountService(
                {} as UserAccountRepository,
                {} as UserLoginMethodRepository,
            );

            // Hash a known password through the service's internal method
            const passwordHash = await (service as any).hashPassword(
                'correctPassword',
            );

            const accountRepo = {
                findPasswordHashByEmail: jest
                    .fn()
                    .mockResolvedValue({ id: user.id, passwordHash }),
                findOne: jest.fn().mockResolvedValue(user),
            } as unknown as UserAccountRepository;

            const loginRepo = {} as unknown as UserLoginMethodRepository;

            const validService = new UserAccountService(
                accountRepo,
                loginRepo,
            );

            const result = await validService.validateLocalCredentials(
                'new-user@meadsoft.com',
                'correctPassword',
            );

            expect(result).toEqual(user);
        });

        it('throws UnauthorizedException when email is not found', async () => {
            const accountRepo = {
                findPasswordHashByEmail: jest.fn().mockResolvedValue(null),
            } as unknown as UserAccountRepository;

            const loginRepo = {} as unknown as UserLoginMethodRepository;

            const service = new UserAccountService(accountRepo, loginRepo);

            await expect(
                service.validateLocalCredentials(
                    'unknown@meadsoft.com',
                    'anyPassword',
                ),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('throws UnauthorizedException when password is incorrect', async () => {
            const service = new UserAccountService(
                {} as UserAccountRepository,
                {} as UserLoginMethodRepository,
            );
            const passwordHash = await (service as any).hashPassword(
                'correctPassword',
            );

            const accountRepo = {
                findPasswordHashByEmail: jest
                    .fn()
                    .mockResolvedValue({ id: 'user-1', passwordHash }),
            } as unknown as UserAccountRepository;

            const loginRepo = {} as unknown as UserLoginMethodRepository;

            const validService = new UserAccountService(
                accountRepo,
                loginRepo,
            );

            await expect(
                validService.validateLocalCredentials(
                    'user@meadsoft.com',
                    'wrongPassword',
                ),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
