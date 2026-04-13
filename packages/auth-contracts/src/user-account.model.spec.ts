import { UserAccountSchema, UserLoginMethodSchema } from './user-account.model';

describe('auth contracts schemas', () => {
    it('accepts a valid user account payload', () => {
        const result = UserAccountSchema.safeParse({
            id: 'f2b3a854-8bd7-4539-ae50-f7dcb8fa9e17',
            email: 'user@meadsoft.com',
            displayName: 'Example User',
            firebaseUid: 'firebase-uid-1',
            iamRoles: ['user'],
            isActive: true,
            createdDate: '2026-01-01T00:00:00.000Z',
            updatedDate: '2026-01-01T00:00:00.000Z',
            createdById: null,
            updatedById: null,
        });

        expect(result.success).toBe(true);
    });

    it('rejects unsupported login provider values', () => {
        const result = UserLoginMethodSchema.safeParse({
            id: 'eb20613d-8f88-442d-aec8-5cb3f981d526',
            userId: 'f2b3a854-8bd7-4539-ae50-f7dcb8fa9e17',
            provider: 'github',
            providerUserId: 'provider-user-id',
            providerEmail: 'user@meadsoft.com',
            isActive: true,
            linkedAt: '2026-01-01T00:00:00.000Z',
        });

        expect(result.success).toBe(false);
    });
});
