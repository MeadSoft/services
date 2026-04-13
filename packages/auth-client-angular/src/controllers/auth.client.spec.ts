import { of } from 'rxjs';
import type { HttpClient } from '@angular/common/http';
import { AuthClient } from './auth.client';

describe('AuthClient', () => {
    it('calls firebase login endpoint with authorization header and credentials', async () => {
        const post = jest.fn().mockReturnValue(
            of({
                id: 'user-id',
                email: 'user@meadsoft.com',
                roles: ['user'],
            }),
        );

        const client = new AuthClient('http://localhost:3000', {
            post,
            get: jest.fn(),
        } as unknown as HttpClient);

        await client.firebaseLogin('firebase-id-token');

        expect(post).toHaveBeenCalledWith(
            'http://localhost:3000/auth/firebase-login',
            {},
            expect.objectContaining({
                withCredentials: true,
            }),
        );
    });

    it('calls register endpoint with email, password and credentials', async () => {
        const post = jest.fn().mockReturnValue(
            of({
                id: 'user-id',
                email: 'user@meadsoft.com',
                roles: ['user'],
            }),
        );

        const client = new AuthClient('http://localhost:3000', {
            post,
            get: jest.fn(),
        } as unknown as HttpClient);

        const result = await client.register({
            email: 'user@meadsoft.com',
            password: 'securePassword123',
            displayName: 'Test User',
        });

        expect(result.id).toBe('user-id');
        expect(post).toHaveBeenCalledWith(
            'http://localhost:3000/auth/register',
            {
                email: 'user@meadsoft.com',
                password: 'securePassword123',
                displayName: 'Test User',
            },
            expect.objectContaining({
                withCredentials: true,
            }),
        );
    });

    it('calls login endpoint with email, password and credentials', async () => {
        const post = jest.fn().mockReturnValue(
            of({
                id: 'user-id',
                email: 'user@meadsoft.com',
                roles: ['user'],
            }),
        );

        const client = new AuthClient('http://localhost:3000', {
            post,
            get: jest.fn(),
        } as unknown as HttpClient);

        const result = await client.login({
            email: 'user@meadsoft.com',
            password: 'securePassword123',
        });

        expect(result.id).toBe('user-id');
        expect(post).toHaveBeenCalledWith(
            'http://localhost:3000/auth/login',
            {
                email: 'user@meadsoft.com',
                password: 'securePassword123',
            },
            expect.objectContaining({
                withCredentials: true,
            }),
        );
    });

    it('calls me endpoint with credentials', async () => {
        const get = jest.fn().mockReturnValue(
            of({
                id: 'user-id',
                email: 'user@meadsoft.com',
                roles: ['user'],
            }),
        );

        const client = new AuthClient('http://localhost:3000', {
            post: jest.fn(),
            get,
        } as unknown as HttpClient);

        const result = await client.me();

        expect(result.id).toBe('user-id');
        expect(get).toHaveBeenCalledWith('http://localhost:3000/auth/me', {
            withCredentials: true,
        });
    });
});
